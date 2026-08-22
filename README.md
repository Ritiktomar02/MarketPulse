# MarketPulse

MarketPulse is a full-stack authentication and cryptocurrency market dashboard application.

The project provides user authentication, Google OAuth login, profile management, cryptocurrency market data, coin details, price trends, and price history graphs using external APIs.

---

## Features

### Authentication

- User registration
- User login
- Google OAuth authentication
- User logout
- Authentication using HTTP-only cookies
- Protected routes

### User Profile

- View profile details
- Edit name
- Edit email
- Edit phone
- Edit bio
- Change password
- Upload profile photo
- Provide profile image URL

### Cryptocurrency Market

- View cryptocurrency coins
- Search coins
- View current coin price
- View 24-hour price change
- View price trend
- View 24-hour high and low
- Select individual coins
- View price history graph
- 1-hour candle interval
- 24 data points for approximately 24 hours of history

### Environment Data

- Fetch environmental temperature data
- Display available location and temperature information

---

## Tech Stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- Axios
- Recharts
- React Icons
- Google OAuth

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Google OAuth
- REST APIs

### External APIs

- Binance API
- Singapore Data.gov.sg Air Temperature API

---

## Project Structure

```text
MarketPulse/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── index.html
│   └── package.json
│
└── README.md