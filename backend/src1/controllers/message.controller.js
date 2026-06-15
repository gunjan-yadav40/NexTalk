import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
  try {
    const filteredUsers = await User.find().select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const { id: userToChatWith } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatWith,
        },
        {
          senderId: userToChatWith,
          receiverId: myId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log(
      "Error in getMessagesByUserId:",
      error
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    console.log("TEXT:", text);
    console.log("IMAGE:", image);

    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId },
        { receiverId: loggedInUserId },
      ],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error in getChatPartners:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
