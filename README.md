# Ecera - Matrimonial Site

A modern matrimonial site built with React, Node.js, and MongoDB that allows users to find their perfect match based on gender preferences and mutual interests.

## Features

### User Management

- User registration and authentication
- Profile creation with photos and detailed information
- Gender and interest preferences (interested in male, female, or both)

### Matching System

- **Potential Matches**: View profiles of users who match your gender preferences and are interested in your gender
- **Interest System**: Send and receive interests from other users
- **Mutual Matches**: See users where both parties have accepted each other's interests
- **Received Interests**: Manage and respond to interests received from other users

### Profile Features

- Upload profile photos
- Complete profile information (name, age, location, occupation, about)
- Gender preference settings
- Interest preferences

### Dashboard

- Tabbed interface showing:
  - Potential Matches
  - Received Interests
  - Mutual Matches
- Profile summary with quick edit access

## Technology Stack

### Frontend

- React 18
- React Router for navigation
- React Hook Form for form handling
- Axios for API calls
- Tailwind CSS for styling
- React Hot Toast for notifications

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Express Validator for input validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Ecera
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Set up environment variables:

```bash
# In backend directory, create .env file
cp env.example .env
```

Edit the `.env` file with your MongoDB connection string and JWT secret:

```
MONGODB_URI=mongodb://localhost:27017/matrimonial-site
JWT_SECRET=your-secret-key
PORT=5000
```

5. Start the backend server:

```bash
cd backend
npm start
```

6. Start the frontend development server:

```bash
# In the root directory
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users with filters
- `GET /api/users/:userId` - Get user by ID

### Interests

- `POST /api/interests/send` - Send interest to a user
- `GET /api/interests/received` - Get received interests
- `GET /api/interests/sent` - Get sent interests
- `PUT /api/interests/:interestId/respond` - Accept/reject interest
- `GET /api/interests/matches` - Get mutual matches

### File Upload

- `POST /api/upload/profile-photo` - Upload profile photo

## Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  age: Number,
  gender: String (male/female/other),
  interestedIn: String (male/female/both),
  location: String,
  occupation: String,
  profilePhoto: String,
  about: String,
  isProfileComplete: Boolean,
  timestamps: true
}
```

### Interest Model

```javascript
{
  fromUser: ObjectId (ref: User),
  toUser: ObjectId (ref: User),
  status: String (pending/accepted/rejected),
  message: String,
  timestamps: true
}
```

## Features in Detail

### Gender-Based Matching

- Users specify their gender and who they're interested in
- The system only shows profiles that match both preferences
- For example: A male user interested in females will only see female users who are interested in males or both

### Interest System

- Users can send interests to potential matches
- Recipients can accept or reject interests
- When both users accept each other's interests, they become mutual matches
- Users can include optional messages with their interests

### Dashboard Tabs

1. **Potential Matches**: Shows users who match your preferences
2. **Received Interests**: Shows users who have sent you interests
3. **Mutual Matches**: Shows users where both parties have accepted each other

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
