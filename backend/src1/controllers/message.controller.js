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
    res.status(200).json([]);
  } catch (error) {
    console.log("Error in getMessagesByUserId:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;

    const senderId = req.user._id;
    if (!text && !image) {
  return res.status(400).json({
    message: "Text or image is required.",
  });
}

if (senderId.equals(receiverId)) {
  return res.status(400).json({
    message: "Cannot send messages to yourself.",
  });
}

const receiverExists = await User.exists({
  _id: receiverId,
});

if (!receiverExists) {
  return res.status(404).json({
    message: "Receiver not found.",
  });
} 
    let imageUrl;
    if(image) {
      //upload base64 image to cloudinary
      const uploadResponse = awaitResponse.secure_url;
      imageUrl = uploadResponse.secure_url;
    }

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