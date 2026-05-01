# PDF Extractor Pro

[![Live Link](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://your-live-link.com)

A professional PDF extraction service built with a focus on performance, security, and clean architecture.
This application allows users to upload PDF documents, preview pages with high clarity, select specific pages, and extract them into a new downloadable PDF.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with secure cookie handling.
- **On-Demand PDF Rendering**: High-performance client-side rendering using `react-pdf` (no heavy image blobs).
- **Page Preview**: High-resolution modal preview for detailed inspection of PDF pages.
- **Efficient Extraction**: Backend page extraction using `pdf-lib` without quality loss.
- **Cloud Storage**: Seamless integration with AWS S3 for secure file storage and presigned URL transfers.
- **Responsive Design**: Modern, clean UI that works perfectly on desktop, tablet, and mobile devices.
- **Layered Architecture**: Strictly follows SOLID principles and the Repository Pattern for scalability.

## 🛠 Tech Stack

### Frontend
- **React 19** (Vite)
- **TypeScript**
- **Zustand** (State Management)
- **Tailwind CSS** (Styling)
- **React PDF** (Document Rendering)
- **Framer Motion** (Animations)
- **Axios** (API Client)

### Backend
- **Node.js + Express**
- **TypeScript**
- **MongoDB + Mongoose** (Database)
- **AWS SDK v3** (S3 Storage)
- **pdf-lib** (PDF Manipulation)
- **Zod** (Schema Validation)
- **JWT + Bcrypt.js** (Security)

## 🏗 Architecture

The backend follows a strict **Layered Architecture**:
- **Core**: Contains Domain Entities and Repository/Service Interfaces.
- **Infrastructure**: Concrete implementations of Repositories (Mongoose, S3).
- **Application**: DTOs, Mappers, and Service logic.
- **Web**: Controllers, Routes, and Middlewares.

## 📥 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local instance
- AWS S3 Bucket

### 1. Clone the repository
```bash
git clone <repository-url>
cd pdf-extractor-antigravity
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_bucket_name
CLIENT_URL=http://localhost:5173
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```
Start the client:
```bash
npm run dev
```

## 🔐 API Endpoints

### Auth
- `POST /api/auth/signup`: Create a new account.
- `POST /api/auth/login`: Authenticate user and set cookie.
- `POST /api/auth/logout`: Clear session cookie.
- `GET /api/auth/me`: Get current user details (Protected).

### PDF Operations
- `GET /api/pdfs`: List all user documents.
- `POST /api/pdfs/presigned-url`: Get S3 upload URL.
- `POST /api/pdfs/metadata`: Save uploaded PDF info.
- `POST /api/pdfs/extract`: Create new PDF from selected pages.
- `GET /api/pdfs/:pdfId/download`: Get secure download URL.

## 📄 License

This project is licensed under the MIT License.
