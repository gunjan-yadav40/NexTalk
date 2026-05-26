import express from "express";

const router = express.Router();
router.get("/send" ,(req,res) => {         //this is header which e will write on local host
    res.send("Send message endpoint");
});
export default router;