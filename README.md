# 💬 NexTalk

NexTalk is a full-stack real-time chat application built with the MERN stack and Socket.IO. It enables users to communicate instantly through secure authentication, real-time messaging, image sharing, and a modern responsive interface.

---

## 🚀 Features

- 🔐 Secure JWT Authentication with HTTP-only Cookies
- 👤 User Signup & Login
- 💬 Real-time One-to-One Messaging using Socket.IO
- 🟢 Online & Offline User Presence
- 🖼️ Image Sharing with Cloudinary
- 📜 Persistent Chat History using MongoDB
- 📧 Automated Welcome Emails using Resend
- 🛡️ Protected Routes
- 📱 Fully Responsive Design
- 🎨 Modern UI built with Tailwind CSS & DaisyUI
- 🌙 Dark Theme Interface

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
- JWT Authentication
- Socket.IO
- Resend

### Deployment & Services

- MongoDB Atlas
- Cloudinary
- Render

---

## 📸 Screenshots

### Login Page

> *(Add login screenshot here)*

![Login](C:\Users\yadav\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-04 184422.png)

---

### Signup Page

> *(Add signup screenshot here)*

![Signup](C:\Users\yadav\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-04 184321.png)

---

### Chat Dashboard

> *(Add chat dashboard screenshot here)*

![Dashboard](C:\Users\yadav\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-04 184229.png)

---

## 📂 Project Structure

```text
NexTalk
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── lib/
│   │   ├── email/
│   │   └── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/gunjan-yadav40/NexTalk.git
```

### Install Backend

```bash
cd backend
npm install
npm run dev
```

### Install Frontend

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

🔗 **Live Application**

https://nextalk-lw1b.onrender.com

> **Note**
>
> The backend is deployed on Render's free tier. If the application has been inactive, the first request may take approximately 30–60 seconds while the server wakes up.

---

## 📈 Future Enhancements

- 👥 Group Chats
- 😊 Emoji Picker
- ✅ Read Receipts
- ⌨️ Typing Indicators
- 🔍 Message Search
- 🔔 Push Notifications
- 📞 Voice Calling
- 🎥 Video Calling

---

## 👨‍💻 Author

**Gunjan Yadav**

- GitHub: https://github.com/gunjan-yadav40


---

## 📄 License

This project was developed for learning, portfolio, and demonstration purposes.
