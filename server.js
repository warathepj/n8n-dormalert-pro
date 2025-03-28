const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Notifications endpoint
app.post('/api/notifications', (req, res) => {
  try {
    const notificationData = req.body;
    
    // Log the notification with monthly charges
    console.log('Notification received:', {
      tenantId: notificationData.id,
      tenantName: notificationData.name,
      room: notificationData.room,
      type: notificationData.notificationType,
      dueDate: notificationData.paymentDueDate,
      totalAmount: notificationData.charges.total,
      monthlyCharges: notificationData.monthlyCharges,  // Added this line
      charges: {  // Detailed charges breakdown
        baseRent: notificationData.charges.baseRent,
        electricityFee: notificationData.charges.electricityFee,
        waterFee: notificationData.charges.waterFee,
        internetFee: notificationData.charges.internetFee,
        parkingFee: notificationData.charges.parkingFee
      }
    });

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully'
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
