# SaatPhere - Modern Matrimonial Platform

A comprehensive matrimonial site built with React, Node.js, and MongoDB that helps users find their perfect life partner through intelligent matching algorithms and a user-friendly interface.

## 🌟 About SaatPhere

SaatPhere (सात फेरे) represents the seven sacred vows taken during Hindu weddings, symbolizing the journey of marriage. Our platform embodies this sacred commitment by helping individuals find their perfect match for a lifetime partnership.

## ✨ Key Features

### 🔐 User Management & Authentication

- **Secure Registration**: Email-based user registration with validation
- **JWT Authentication**: Secure login with token-based authentication
- **Profile Management**: Complete profile creation with photos and detailed information
- **Privacy Controls**: User-controlled privacy settings and preferences

### 💕 Intelligent Matching System

- **Smart Matching**: Algorithm-based matching using gender preferences and mutual interests
- **Potential Matches**: Discover users who match your preferences
- **Interest System**: Send and receive interests with optional messages
- **Mutual Matches**: View successful matches where both parties are interested
- **Advanced Filters**: Search by age, location, gender, and other criteria

### 📱 Responsive Design

- **Mobile-First**: Fully responsive design that works on all devices
- **Modern UI**: Beautiful gradient designs with smooth animations
- **Intuitive Navigation**: Easy-to-use interface with tabbed dashboard
- **Real-time Updates**: Instant notifications and status updates

### 🎯 Profile Features

- **Photo Upload**: Upload and manage profile photos
- **Detailed Information**: Age, location, occupation, and personal description
- **Preference Settings**: Gender and interest preferences
- **Profile Completion**: Guided profile completion process

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Beautiful notifications
- **Vite** - Fast build tool and dev server

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server with auto-restart

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd SaatPhere
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Install backend dependencies**

```bash
cd backend
npm install
```

4. **Environment Setup**

```bash
# In backend directory, create .env file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/saatphere
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

5. **Start the backend server**

```bash
cd backend
npm start
```

6. **Start the frontend development server**

```bash
# In the root directory
npm run dev
```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | User registration |
| POST   | `/api/auth/login`    | User login        |

### User Management

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| GET    | `/api/users/profile` | Get current user profile  |
| PUT    | `/api/users/profile` | Update user profile       |
| GET    | `/api/users/search`  | Search users with filters |
| GET    | `/api/users/:userId` | Get user by ID            |

### Interest System

| Method | Endpoint                             | Description             |
| ------ | ------------------------------------ | ----------------------- |
| POST   | `/api/interests/send`                | Send interest to a user |
| GET    | `/api/interests/received`            | Get received interests  |
| GET    | `/api/interests/sent`                | Get sent interests      |
| PUT    | `/api/interests/:interestId/respond` | Accept/reject interest  |
| GET    | `/api/interests/matches`             | Get mutual matches      |

### File Upload

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| POST   | `/api/upload/profile-photo` | Upload profile photo |


## 🎨 Features in Detail

### Intelligent Matching Algorithm

- **Gender-Based Filtering**: Users only see profiles matching their gender preferences
- **Mutual Interest Matching**: Both users must be interested in each other's gender
- **Advanced Search Filters**: Age range, location, and other criteria
- **Real-time Updates**: Instant matching and interest notifications

### Dashboard Experience

1. **Potential Matches Tab**: Discover new users who match your preferences
2. **Received Interests Tab**: Manage interests from other users
3. **Sent Interests Tab**: Track your sent interests and their status
4. **Mutual Matches Tab**: View successful matches and connections

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request security
- **File Upload Security**: Secure file upload with validation

### User Experience

- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Smooth Animations**: Beautiful transitions and hover effects
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error messages and validation
- **Profile Completion**: Guided profile setup process

## 🔧 Development

### Project Structure

```
SaatPhere/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── Navbar.jsx     # Navigation bar
│   │   └── ...           # Other components
│   ├── context/
│   │   └── AuthContext.jsx # Authentication context
│   └── main.jsx          # App entry point
├── backend/
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   └── server.js         # Server entry point
└── public/              # Static assets
```

**Made with ❤️ for finding perfect matches**
