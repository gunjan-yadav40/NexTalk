import { useRef, useState, useEffect } from "react";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, isSoundEnabled, selectedUser } = useChatStore();
  const { sendTypingIndicator } = useAuthStore();

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    if (!selectedUser) return;

    // Send typing indicator
    if (newText.trim().length > 0) {
      sendTypingIndicator(selectedUser._id, true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 1.5 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(selectedUser._id, false);
      }, 1500);
    } else {
      // If text is empty, stop typing
      sendTypingIndicator(selectedUser._id, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);

    // Stop typing indicator after sending
    if (selectedUser) {
      sendTypingIndicator(selectedUser._id, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => setImagePreview(reader.result);

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 border-t border-slate-700/50 bg-slate-800/20">
      {/* Image Preview */}
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-24 w-24 object-cover rounded-lg border-2 border-cyan-500/50"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex items-end gap-2"
      >
        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={handleTextChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type your message..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
            rows={Math.min(4, Math.max(1, text.split("\n").length))}
            style={{
              minHeight: "42px",
              maxHeight: "120px",
            }}
          />
        </div>

        {/* Image Upload Button */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2.5 rounded-lg transition-all duration-200 ${
            imagePreview
              ? "bg-cyan-500 text-white"
              : "bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          }`}
          title="Attach image"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="p-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-cyan-500 disabled:hover:to-blue-500 group"
          title="Send message"
        >
          <SendIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;