# AgriTrack — Smart Farm Expense & Financial Management

AgriTrack is a full-stack farm management and financial tracking application designed to help farmers manage their **farms, crops, income, expenses, budgets, and financial reports** from one centralized platform.

The project also includes an **AI-powered farming financial assistant** that analyzes the user's actual financial data and provides practical recommendations related to profitability, expenses, crop performance, and budget management.

---

## Features

### Dashboard

- Overview of important farm and financial information
- Total income and expenses
- Profit/loss information
- Crop and farm statistics
- Quick access to major modules

### Farm Management

- Add and manage farms
- Store farm-related information
- Manage multiple farms under one account

### Crop Management

- Add crops to farms
- Track crop-related financial information
- Manage multiple crops across different farms

### Income Management

- Record crop-related income
- Track income amounts
- View income information for individual crops

### Expense Management

- Record farming expenses
- Categorize expenses
- Track spending for individual crops
- Analyze major expense categories

### Budget Management

- Create budgets for different expense categories
- Set planned spending amounts
- Compare planned budget with actual expenses
- Identify budget overruns

### Financial Analysis

- Analyze total income and expenses
- Calculate profit/loss
- Compare crop profitability
- Analyze expense categories
- Monitor financial performance

### Reports

- View summarized financial information
- Analyze farming income and expenses
- Generate useful financial insights from stored data

### AI Farming Financial Assistant

AgriTrack includes an AI-powered financial assistant using **Google Gemini**.

The AI assistant uses the farmer's actual application data, including:

- Total income
- Total expenses
- Profit/loss
- Number of farms
- Number of crops
- Crop-wise income
- Crop-wise expenses
- Expense categories
- Planned budgets
- Actual spending

The farmer can ask questions such as:

> "Which crop is most profitable?"

> "Where am I spending too much?"

> "How can I reduce my farming expenses?"

> "Am I exceeding any of my budgets?"

The AI analyzes the available data and provides practical recommendations.

**Important:** The AI is instructed to use only the financial data provided by the application and not invent financial figures.

---

## What Makes AgriTrack Different?

Many agricultural platforms focus primarily on **crop management, weather information, market prices, or farming guidance**.

AgriTrack focuses specifically on the **financial side of farm management**.

The application combines:

**Farm Management + Crop Management + Income Tracking + Expense Tracking + Budget Management + Financial Analysis + AI Financial Assistance**

The unique aspect of the project is the integration of an **AI assistant with the farmer's actual financial records**.

Instead of providing generic farming advice, the AI can analyze the user's stored income, expenses, crops, and budgets to generate personalized financial insights.

---

## AI Workflow

The AI financial assistant follows this process:

```text
Farmer asks a question
        ↓
Authenticated request reaches backend
        ↓
Backend identifies the logged-in farmer
        ↓
Financial data is retrieved from MySQL
        ↓
Income + Expenses + Crops + Budgets are collected
        ↓
Financial summary is prepared
        ↓
Data is sent to Google Gemini
        ↓
Gemini analyzes the financial information
        ↓
AI-generated insight is returned
        ↓
Insight displayed to the farmer
```

---

## Project Architecture

AgriTrack follows a structured full-stack architecture.

```text
AgriTrack
│
├── backend
│   ├── config
│   ├── controller
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

### Backend Architecture

The backend follows a layered structure:

```text
Routes
  ↓
Controllers
  ↓
Models
  ↓
MySQL Database
```

This separation makes the application easier to maintain and extend.

---

## Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- MySQL
- Google Gemini API

### Database

- MySQL
- Relational database design
- Foreign key relationships
- SQL queries for financial analysis

### AI

- Google Gemini
- AI-powered financial analysis
- Personalized recommendations based on application data

---

## Authentication & Security

AgriTrack uses authentication to protect user-specific information.

- User registration
- User login
- JWT-based authentication
- Protected API routes
- User-specific farm and financial data
- Environment variables for sensitive API credentials

Sensitive credentials such as the Gemini API key are stored in environment variables and are not committed to the repository.

---

## 🔌 Main API Modules

The backend provides REST API modules for:

| Module         | Endpoint         |
| -------------- | ---------------- |
| Authentication | `/api/auth`      |
| Farms          | `/api/farm`      |
| Crops          | `/api/crop`      |
| Expenses       | `/api/expenses`  |
| Income         | `/api/income`    |
| Analysis       | `/api/analysis`  |
| Budget         | `/api/budget`    |
| Dashboard      | `/api/dashboard` |
| Reports        | `/api/reports`   |
| AI Assistance  | `/api/ai`        |

### AI Endpoint

```text
POST /api/ai/insight
```

The endpoint accepts a farmer's question and generates an AI financial insight using the farmer's stored financial data.

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/AgriTrack.git
cd AgriTrack
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

**Never commit your `.env` file to GitHub.**

---

## 🗄️ Database Setup

1. Install MySQL.
2. Create the AgriTrack database.
3. Create the required tables using MySQL Workbench.
4. Configure the database credentials in the backend `.env` file.
5. Start the backend server.

Make sure the database name and credentials match your environment configuration.

---

## ▶️ Running the Application

### Start Backend

From the `backend` directory:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### Start Frontend

From the `frontend` directory:

```bash
npm run dev
```

Vite will provide the local development URL, usually:

```text
http://localhost:5173
```

---

## 📱 Responsive Interface

The application is designed with responsive layouts so that major parts of the application can be accessed across different screen sizes.

The dashboard includes:

- Responsive navigation
- Mobile sidebar
- Responsive cards
- Responsive forms
- Mobile-friendly AI assistance interface

---

## Future Scope

AgriTrack can be further enhanced with:

- Weather API integration
- Crop price and market-rate tracking
- Progressive Web App / mobile application
- Expense and budget notifications
- Voice-based AI assistant
- Regional language support
- Advanced financial forecasting
- Crop yield prediction
- AI-based crop disease detection
- Cloud deployment
- Exportable PDF financial reports

---

## Project Objective

The main objective of AgriTrack is to provide farmers with a simple digital platform for managing the **financial aspects of farming**.

By combining traditional financial tracking with AI-powered analysis, the application aims to help farmers better understand:

- Where their money is being spent
- Which crops are generating better returns
- Whether they are staying within their budgets
- Their overall farming profitability
- How they can potentially control unnecessary expenses

---

## Developed By

**Kalyani Pawar**

AgriTrack was developed as a full-stack project to demonstrate practical implementation of:

- Frontend development
- Backend API development
- Database management
- Authentication
- Financial data analysis
- AI integration
- Responsive UI design

---

## If You Like This Project

If you find AgriTrack useful or interesting, consider giving the repository a on GitHub.

---

## License

This project is created for educational and portfolio purposes.
