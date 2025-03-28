import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/qrcodes', express.static('qrcodes')); // Serve QR code images statically

// Ensure qrcodes directory exists
const qrcodesDir = path.join(__dirname, 'qrcodes');
try {
  await fs.mkdir(qrcodesDir, { recursive: true });
} catch (err) {
  console.error('Error creating qrcodes directory:', err);
}

// Generate mock payment data
function generateMockPaymentData() {
  const paymentMethods = ['GCash', 'Maya', 'Bank Transfer', 'Credit Card'];
  const banks = ['BDO', 'BPI', 'Metrobank', 'UnionBank'];
  const referencePrefix = ['PAY', 'TXN', 'REF', 'INV'];

  return {
    id: crypto.randomBytes(8).toString('hex'),
    timestamp: new Date().toISOString(),
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    bank: banks[Math.floor(Math.random() * banks.length)],
    reference: `${referencePrefix[Math.floor(Math.random() * referencePrefix.length)]}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    expiresIn: Math.floor(Math.random() * 24) + 24, // Random hours between 24-48
    merchantCode: `M${crypto.randomBytes(6).toString('hex').toUpperCase()}`
  };
}

// Function to generate QR code and save as file
async function generateQRCode(data) {
  try {
    const filename = `qr-${crypto.randomBytes(4).toString('hex')}.png`;
    const filePath = path.join(qrcodesDir, filename);
    
    const qrCodeOptions = {
      errorCorrectionLevel: 'H',
      type: 'png',
      quality: 0.92,
      margin: 1,
      width: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    };
    
    // Generate and save QR code
    await QRCode.toFile(filePath, JSON.stringify(data), qrCodeOptions);
    
    // Clean up old QR codes (keep only last 100 files)
    const files = await fs.readdir(qrcodesDir);
    if (files.length > 100) {
      const oldFiles = files
        .map(f => ({ name: f, time: fs.stat(path.join(qrcodesDir, f)).mtime }))
        .sort((a, b) => b.time - a.time)
        .slice(100);
      
      for (const file of oldFiles) {
        await fs.unlink(path.join(qrcodesDir, file.name)).catch(console.error);
      }
    }
    
    return filename;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

// QR Code endpoint
app.get('/api/qrcode/generate', (req, res) => {
  try {
    const mockData = generateMockQRData();
    
    res.status(200).json({
      success: true,
      qrData: mockData,
      message: 'QR code data generated successfully'
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Notifications endpoint
app.post('/api/notifications', async (req, res) => {
  try {
    const notificationData = req.body;
    
    // Generate mock payment data
    const mockPaymentData = generateMockPaymentData();
    
    // Generate QR code and get filename
    const qrCodeFilename = await generateQRCode(mockPaymentData);
    
    // Construct QR code URL
    const qrCodeUrl = `${req.protocol}://${req.get('host')}/qrcodes/${qrCodeFilename}`;
    
    // Add mock payment data and QR code URL to notification data
    const webhookData = {
      ...notificationData,
      paymentData: mockPaymentData,
      qrCodeUrl
    };

    // Forward the data to webhook
    const webhookResponse = await fetch('http://localhost:5678/webhook-test/8906c978-d57f-40c0-b4d0-cbf8736fbaa1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookData)
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed with status: ${webhookResponse.status}`);
    }

    // Send back the QR code URL and payment data to frontend
    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      qrCodeUrl,
      paymentData: mockPaymentData
    });
  } catch (error) {
    console.error('Error processing notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process notification'
    });
  }
});

// Default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
