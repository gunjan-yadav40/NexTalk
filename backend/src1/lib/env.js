
import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
};

// PORT=3000

// MONGO_URI=mongodb://yadavgunjan2027:gunjan2327@ac-lliaprz-shard-00-00.nx4tzzc.mongodb.net:27017,ac-lliaprz-shard-00-01.nx4tzzc.mongodb.net:27017,ac-lliaprz-shard-00-02.nx4tzzc.mongodb.net:27017/NexTalk_db?ssl=true&replicaSet=atlas-11rp38-shard-0&authSource=admin&appName=Clustertest

// NODE_ENV=development
// JWT_SECRET=myjwtsecret
// RESEND_API_KEY=re_ZWQwFYUG_2hP4A664BYTwBB1L9Co8b5BN

// EMAIL_FROM="onboarding@resend.dev"
// EMAIL_FROM_NAME='GUNJAN YADAV'
// CLIENT_URL=http://localhost:5173