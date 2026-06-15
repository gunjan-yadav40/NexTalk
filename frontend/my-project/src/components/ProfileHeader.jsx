import { useState, useRef } from "react";
import { 
  LogOutIcon, 
  VolumeOffIcon, 
  Volume2Icon, 
  CameraIcon, 
  CheckIcon,
  LoaderIcon 
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

function ProfileHeader() {
  const { logout, authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);

      try {
        await updateProfile({ profilePic: base64Image });
        toast.success("Profile picture updated!");
      } catch (error) {
        toast.error("Failed to update profile picture");
        setSelectedImg(null);
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read image file");
      setIsUploading(false);
    };
  };

  const getInitials = () => {
    if (!authUser?.fullName) return "?";
    return authUser.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm">Are you sure you want to logout?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              logout();
            }}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs"
          >
            Yes, Logout
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-slate-700 text-white rounded-lg text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  return (
    <div className="p-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-800/30">
      <div className="flex items-center justify-between">
        {/* Left Section - Avatar & User Info */}
        <div className="flex items-center gap-4">
          {/* Avatar with Upload Overlay */}
          <div className="relative">
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Avatar Image */}
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-slate-700/50 group-hover:ring-cyan-500/50 transition-all duration-300">
                {(selectedImg || authUser?.profilePic) ? (
                  <img
                    src={selectedImg || authUser?.profilePic}
                    alt={authUser?.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {getInitials()}
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Overlay */}
              {isHovering && !isUploading && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-all duration-200">
                  <CameraIcon className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Uploading Spinner */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                  <LoaderIcon className="w-5 h-5 text-white animate-spin" />
                </div>
              )}

              {/* Online Status Dot */}
              <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900" />
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-white font-semibold text-base max-w-[180px] truncate">
              {authUser?.fullName || "User"}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-slate-400 text-xs">Online</p>
            </div>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex gap-3 items-center">
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200 group"
            title={isSoundEnabled ? "Disable sound" : "Enable sound"}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            ) : (
              <VolumeOffIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all duration-200 group"
            title="Logout"
          >
            <LogOutIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
