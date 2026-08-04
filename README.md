# 💬 NexTalk

NexTalk is a full-stack real-time chat application built using the MERN stack and Socket.IO. It enables users to communicate instantly through secure authentication, real-time messaging, image sharing, and a modern responsive interface.

---

## 🚀 Features

- Secure JWT Authentication
- User Signup & Login
- HTTP-only Cookie Authentication
- Real-time Messaging using Socket.IO
- Online & Offline User Status
- Image Sharing with Cloudinary
- Persistent Chat History
- Welcome Email Integration using Resend
- Protected Routes
- Responsive UI for Desktop & Mobile
- Dark/Light Theme Support

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Zustand
- React Router DOM
- Axios
- Tailwind CSS
- DaisyUI
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO
- Resend

### Deployment & Services

- MongoDB Atlas
- Cloudinary
- Render

---

## 📂 Project Structure

```text
NexTalk
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── lib
│   │   └── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/gunjan-yadav40/NexTalk.git
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=

MONGO_URI=

JWT_SECRET=

CLIENT_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RESEND_API_KEY=
EMAIL_FROM=
EMAIL_FROM_NAME=
```

---

## 🌐 Live Demo

**Live Application**

https://nextalk-lw1b.onrender.com

> **Note**
>
> The application is hosted on Render's free tier. If the application has been inactive, the backend may take 30–60 seconds to wake up before responding to the first request.

---

## 📌 Future Improvements

- Group Chat
- Voice Calling
- Video Calling
- Message Search
- Read Receipts
- Push Notifications
- Message Reactions

---

## 👨‍💻 Author

**Gunjan Yadav**

- GitHub: https://github.com/gunjan-yadav40

---

## 📄 License

This project is created for educational and portfolio purposes.
