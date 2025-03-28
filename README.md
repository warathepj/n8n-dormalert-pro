# Dormitory Logbook

A modern web application for managing dormitory rental records and payments, featuring a retro 2000s-inspired brown theme.

## Features

- Tenant Information Management

  - Record full name, contact number, move-in date, and room number
  - Edit and delete tenant records
  - View detailed tenant information

- Monthly Charges Tracking

  - Base room rent
  - Utilities (electricity and water)
  - Internet/WiFi fees
  - Parking fees
  - Automated total calculation

- Payment Management

  - Due date tracking
  - QR code generation for payments
  - Payment status monitoring
  - Digital receipt generation

- Notification System
  - Backend integration with n8n workflow
  - Automated Telegram notifications
  - QR code sharing via Telegram

## Tech Stack

- Frontend:

  - React with TypeScript
  - Vite for build tooling
  - Tailwind CSS for styling
  - shadcn/ui components
  - React Query for data fetching
  - React Router for navigation

- Backend:
  - Node.js
  - Express
  - QR Code generation
  - RESTful API endpoints
  - n8n integration for workflow automation
  - Telegram bot integration

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- n8n instance for workflow automation
- Telegram bot token

### Installation

1. Clone the repository:

```bash
git clone https://github.com/warathepj/dormitory-logbook.git
git clone https://github.com/warathepj/n8n-dormalert-pro.git
```

2. Install frontend dependencies:

```bash
cd dormitory-logbook
npm install
```

3. Install backend dependencies:

```bash
cd n8n-dormalert-pro
npm install
```

### Development

1. Start the frontend development server:

```bash
cd dormitory-logbook
npm run dev
```

The application will be available at `http://localhost:8080`

2. Start the backend server:

```bash
cd n8n-dormalert-pro
npm run dev
```

The backend API will be available at `http://localhost:3000`

3. Configure n8n workflow:
   - Set up n8n webhook endpoint
   - Configure Telegram bot integration
   - Set up notification templates

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Styling inspired by 2000s web design
- n8n for workflow automation
- Telegram Bot API for notifications
