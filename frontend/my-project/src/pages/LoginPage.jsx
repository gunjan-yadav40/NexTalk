import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-7xl">
        <BorderAnimatedContainer>
          <div className="flex flex-col md:flex-row">
            {/* LEFT SIDE */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-10 py-12">
              <div className="w-full max-w-md">
                {/* HEADER */}
                <div className="text-center mb-10">
                  <div className="w-24 h-24 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                    <MessageCircleIcon className="w-10 h-10 text-cyan-400" />
                  </div>

                  <h1 className="text-5xl font-bold text-white mb-4">
                    Welcome Back
                  </h1>

                  <p className="text-slate-400 text-lg">
                    Sign in to continue your conversations.
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* EMAIL */}
                  <div>
                    <label className="auth-input-label">
                      Email Address
                    </label>

                    <div className="relative">
                      <MailIcon className="auth-input-icon" />

                      <input
                        type="email"
                        className="input"
                        placeholder="gunjan2027@gmail.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="auth-input-label">
                      Password
                    </label>

                    <div className="relative">
                      <LockIcon className="auth-input-icon" />

                      <input
                        type="password"
                        className="input"
                        placeholder="••••••••••"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    type="submit"
                    className="auth-btn"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <LoaderIcon className="size-5 animate-spin mx-auto" />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                {/* FOOTER */}
                <div className="mt-8 text-center">
                  <p className="text-slate-400">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      Create one
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center border-l border-slate-800/50">
              <div className="max-w-lg text-center">
                <img
                  src="/login.png"
                  alt="People chatting"
                  className="w-[430px] mx-auto object-contain"
                />

                <h2 className="mt-8 text-4xl font-bold text-white">
                  Stay Connected
                </h2>

                <p className="mt-4 text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
                  Chat instantly, share moments, and stay connected
                  with the people who matter most.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <span className="auth-badge">
                    Instant Chat
                  </span>

                  <span className="auth-badge">
                    Secure
                  </span>

                  <span className="auth-badge">
                    Real-Time
                  </span>

                  <span className="auth-badge">
                    Reliable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default LoginPage;