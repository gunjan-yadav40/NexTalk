import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  LoaderIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ZapIcon,
  UsersIcon,
} from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const features = [
    { icon: ZapIcon, text: "Instant Chat", color: "text-yellow-400" },
    { icon: ShieldCheckIcon, text: "End-to-End Secure", color: "text-green-400" },
    { icon: UsersIcon, text: "Real-Time", color: "text-blue-400" },
    { icon: SparklesIcon, text: "Always Reliable", color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-7xl relative z-10">
        <BorderAnimatedContainer>
          <div className="grid lg:grid-cols-2 overflow-hidden">
            {/* LEFT SIDE - FORM */}
            <div className="flex items-center justify-center px-6 py-12 lg:px-12 lg:py-16 bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-sm">
              <div className="w-full max-w-md">
                {/* LOGO & HEADER */}
                <div className="text-center mb-12">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-2xl">
                      <MessageCircleIcon className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-4">
                    Welcome Back
                  </h1>

                  <p className="text-slate-400 text-lg">
                    Glad to see you again! 👋
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* EMAIL FIELD */}
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
                      Email Address
                    </label>

                    <div className={`relative transition-all duration-300 ${
                      focusedField === "email" ? "scale-[1.02]" : ""
                    }`}>
                      <MailIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                        focusedField === "email" 
                          ? "text-cyan-400" 
                          : "text-slate-500 group-hover:text-slate-400"
                      }`} />

                      <input
                        type="email"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border-2 rounded-xl text-white placeholder:text-slate-500 focus:outline-none transition-all duration-300"
                        style={{
                          borderColor: focusedField === "email" 
                            ? "#06b6d4" 
                            : "rgba(51, 65, 85, 0.5)",
                          boxShadow: focusedField === "email"
                            ? "0 0 0 4px rgba(6, 182, 212, 0.1)"
                            : "none",
                        }}
                        placeholder="hello@example.com"
                        value={formData.email}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* PASSWORD FIELD */}
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
                      Password
                    </label>

                    <div className={`relative transition-all duration-300 ${
                      focusedField === "password" ? "scale-[1.02]" : ""
                    }`}>
                      <LockIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                        focusedField === "password" 
                          ? "text-cyan-400" 
                          : "text-slate-500 group-hover:text-slate-400"
                      }`} />

                      <input
                        type="password"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border-2 rounded-xl text-white placeholder:text-slate-500 focus:outline-none transition-all duration-300"
                        style={{
                          borderColor: focusedField === "password" 
                            ? "#06b6d4" 
                            : "rgba(51, 65, 85, 0.5)",
                          boxShadow: focusedField === "password"
                            ? "0 0 0 4px rgba(6, 182, 212, 0.1)"
                            : "none",
                        }}
                        placeholder="••••••••"
                        value={formData.password}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* FORGOT PASSWORD LINK */}
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* SIGN IN BUTTON */}
                  <button
                    type="submit"
                    className="relative w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
                    disabled={isLoggingIn}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoggingIn ? (
                        <>
                          <LoaderIcon className="w-5 h-5 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <SparklesIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </form>

                {/* SIGN UP LINK */}
                <div className="mt-10 text-center">
                  <p className="text-slate-400">
                    New to Chatapp?{" "}
                    <Link
                      to="/signup"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold transition-all duration-300 hover:underline underline-offset-4"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - FEATURES */}
            <div className="hidden lg:flex flex-col items-center justify-center px-12 py-16 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
              <div className="w-full max-w-lg text-center">
                {/* ILLUSTRATION */}
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
                  <img
                    src="/login.png"
                    alt="People chatting"
                    className="w-full max-w-md mx-auto object-contain relative z-10 animate-float"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/400x400/1e293b/06b6d4?text=Chat+Illustration";
                    }}
                  />
                </div>

                {/* TAGLINE */}
                <div className="mb-8">
                  <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-4">
                    Stay Connected
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Chat instantly, share moments, and stay connected with the
                    people who matter most.
                  </p>
                </div>

                {/* FEATURE BADGES */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="group flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105"
                      >
                        <div className={`p-2 rounded-lg bg-slate-700/50 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-5 h-5 ${feature.color}`} />
                        </div>
                        <span className="text-slate-300 font-medium">
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* SOCIAL PROOF */}
                <div className="mt-12 pt-8 border-t border-slate-700/50">
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <span className="text-sm">Trusted by</span>
                    <span className="text-cyan-400 font-bold text-lg">10,000+</span>
                    <span className="text-sm">users worldwide</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;