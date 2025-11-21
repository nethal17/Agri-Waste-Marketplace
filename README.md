# Waste2Wealth - Web Application

![alt text](image.png)

A comprehensive web-based agricultural waste management platform connecting farmers with buyers to facilitate the buying and selling of agricultural waste products, promoting sustainability and circular economy in agriculture.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.0.0-blue.svg)

## Overview

This is our Y2S2 ITP Project - an **Agri-waste Management System** that helps manage agricultural waste generated from agricultural activities. This application connects farmers with agri-waste buyers and recycling companies by providing an e-commerce platform to buy and sell agricultural waste.

The platform is built using **MERN Stack** (MongoDB, Express, React, Node.js) technology, offering a complete solution for sustainable agricultural waste management with features including product listings, secure payments, delivery management, and comprehensive analytics.

## Team Members

- **IT23259102** - Fernando W.S.N.J.
- **IT23294134** - Ricky H.P.C.
- **IT23426658** - Kalpitha W.K.V.
- **IT23247918** - Weerasinghe P.N.M.
- **IT23404250** - Thathsarani K.G.Y.V.

## Features

### For Farmers
- **Product Listings**: Create and manage agricultural waste product listings
- **Payment Management**: Track sales and manage payments through Stripe
- **Review System**: Receive and manage customer reviews
- **Analytics Dashboard**: Monitor sales performance and inventory levels
- **Order Management**: Track and manage incoming orders

### For Buyers
- **Product Search**: Browse and search agricultural waste products by category
- **Shopping Cart**: Add products to cart and manage orders
- **Secure Checkout**: Complete purchases with Stripe payment integration
- **Address Management**: Save and manage multiple delivery addresses
- **Order History**: Track past orders and download invoices
- **Product Reviews**: Rate and review purchased products

### For Truck Drivers
- **Delivery Management**: View and manage delivery requests
- **Route Optimization**: Access delivery addresses and optimize routes
- **Payment Tracking**: Track delivery payments and earnings
- **Vehicle Registration**: Register and manage vehicle information

### For Admins
- **User Management**: Manage all platform users and roles
- **Analytics Dashboard**: View platform-wide statistics and insights
- **Product Approval**: Review and approve farmer product listings
- **Refund Management**: Handle refund requests and process payments
- **Reports**: Generate comprehensive business reports

## Tech Stack

### Frontend
- **Framework**: React 19.0.0
- **Build Tool**: Vite 6.2.0
- **Styling**: 
  - Tailwind CSS 3.4.17
  - Ant Design 5.24.8
  - Material-UI 7.0.2
  - Framer Motion 12.9.2
- **State Management**: React Hooks
- **Routing**: React Router DOM 7.4.0
- **HTTP Client**: Axios 1.9.0
- **Charts**: Recharts 2.15.3, Chart.js 4.4.9
- **Payments**: Stripe.js 6.1.0

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB (Mongoose 8.12.1)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 3.0.2
- **File Upload**: Multer 1.4.5, Cloudinary 2.6.0
- **Email**: Nodemailer 7.0.10
- **Payments**: Stripe 17.7.0
- **PDF Generation**: PDFKit 0.17.0

## Project Structure

```
Agri-Waste-Marketplace/
├── backend/
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── cartController.js
│   │   ├── deliveryController.js
│   │   ├── paymentController.js
│   │   └── ...
│   ├── models/               # Database models
│   │   ├── user.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   └── ...
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── ...
│   ├── middleware/           # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── utils/                # Utility functions
│   │   ├── emailService.js
│   │   └── inventoryUtils.js
│   ├── app.js                # Express app configuration
│   ├── index.js              # Server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # Static assets
│   │   ├── components/       # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ui/           # UI components
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderDashboard.jsx
│   │   │   └── ...
│   │   ├── utils/            # Utility functions
│   │   │   └── api.js        # API service
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # App entry point
│   │   └── index.css         # Global styles
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nethal17/Agri-Waste-Marketplace.git
   cd Agri-Waste-Marketplace
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend` directory:

```bash
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/DatabaseName?retryWrites=true&w=majority&appName=AppName

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```bash
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### Running the Application

#### Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

#### Production Mode

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```

## 👥 User Roles

The platform supports four distinct user roles:

### 1. **Farmer**
- List agricultural waste products
- Manage inventory and pricing
- Track sales and revenue
- Communicate with buyers
- Receive and respond to reviews

### 2. **Buyer**
- Browse and search products
- Purchase agricultural waste
- Manage orders and deliveries
- Leave product reviews
- Track order history

### 3. **Truck Driver**
- Accept delivery requests
- Manage delivery schedules
- Update delivery status
- Track earnings
- Register vehicles

### 4. **Admin** 
- Manage all users
- Approve/reject product listings
- Handle refunds
- Monitor platform analytics
- Generate reports

## API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
GET    /api/auth/searchUser/:id    - Get user details
POST   /api/auth/toggle-2fa        - Enable/disable 2FA
GET    /api/auth/login-history     - Get login history
```

### Product Endpoints

```
GET    /api/marketplace/listings           - Get all products
POST   /api/marketplace/create-listing     - Create product listing
GET    /api/marketplace/listing/:id        - Get product details
PUT    /api/marketplace/update-listing/:id - Update product
DELETE /api/marketplace/delete-listing/:id - Delete product
GET    /api/marketplace/farmer-listings/:id - Get farmer's listings
```

### Cart & Checkout

```
GET    /api/cart/:userId               - Get user cart
POST   /api/cart/add                   - Add to cart
DELETE /api/cart/:userId/:wasteId      - Remove from cart
POST   /api/checkout/create-session    - Create Stripe session
```

### Orders

```
GET    /api/order-history                  - Get all orders
GET    /api/order-history/user/:userId     - Get user orders
POST   /api/order-history/create           - Create order
PUT    /api/order-history/:id/status       - Update order status
```

### Reviews

```
GET    /api/reviews/product/:productName    - Get product reviews
POST   /api/reviews/add                     - Add review
GET    /api/reviews/farmer-reviews/:id      - Get farmer reviews
```

### Delivery

```
GET    /api/delivery-history                - Get all deliveries
POST   /api/delivery-history/create         - Create delivery
PUT    /api/delivery-history/:id/accept     - Accept delivery
PUT    /api/delivery-history/:id/complete   - Complete delivery
```

## Payment Integration

The platform uses **Stripe** for secure payment processing:

- **Test Mode**: Use Stripe test cards for development
  - Card: `4242 4242 4242 4242`
  - Expiry: Any future date
  - CVC: Any 3 digits

- **Production**: Configure Stripe live keys in environment variables

### Payment Flow
1. Buyer adds products to cart
2. Proceeds to checkout
3. Stripe creates a secure checkout session
4. Payment is processed via Stripe
5. Order is confirmed and delivery is initiated
6. Funds are transferred to farmer's account

## Testing

### Frontend Testing
```bash
cd frontend
npm run lint          # Run ESLint
npm run build         # Test production build
```

### Backend Testing
```bash
cd backend
npm start             # Start server and check for errors
```

## Key Features Implementation

### Real-time Updates
- Order status tracking
- Delivery notifications
- Inventory updates

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Two-factor authentication (2FA)
- Role-based access control (RBAC)
- Secure payment processing

### Analytics & Reporting
- Sales dashboards
- Inventory analytics
- Revenue tracking
- User activity logs
- Performance metrics

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint rules for frontend
- Use meaningful variable and function names
- Add comments for complex logic
- Write clean, maintainable code

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to all team members who contributed to this project
- Inspired by the need for sustainable agricultural waste management
- Built with modern web technologies and best practices
- Special thanks to our supervisors and mentors

## Support

For support or queries, please contact any of the team members or open an issue in the repository.

---

**Made with ❤️ for sustainable agriculture | ITP Project 2024**


