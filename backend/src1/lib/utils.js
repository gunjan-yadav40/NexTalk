import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export  const generateToken = (userId,res) => {
    const{ JWT_SECRET } = ENV;
    if(!JWT_SECRET) throw new Error("MONGO_URI is not set");
    //
    const token = jwt.sign({userId},ENV.JWT_SECRET,{
         expiresIn:"7d",
    });

    res.cookie("jwt",token, {
        maxAge:7*24*60*60*1000 ,//ms
        httpOnly: true,//prevent XSS attcks: cross-site scripting
        sameSite: "strict", //CSRF attcks
        secure:ENV.NODE_ENV === "development" ? false : true,




    });

    return token;
};

// http://localhost
//https://dsmakmk.com