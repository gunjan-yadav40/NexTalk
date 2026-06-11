import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import {
  UserIcon,
  LockIcon,
  MailIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
  <div className="w-full max-w-7xl">
    <BorderAnimatedContainer>
      <div className="flex flex-col md:flex-row">
        
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-10 py-12">
          <div className="w-full max-w-md">
            
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-24 h-24 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                <UserIcon className="w-10 h-10 text-cyan-400" />
              </div>

              <h1 className="text-5xl font-bold text-white mb-4">
                Create Account
              </h1>

              <p className="text-slate-400 text-lg">
                Join thousands of users and start chatting today.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="auth-input-label">
                  Full Name
                </label>

                <div className="relative">
                  <UserIcon className="auth-input-icon" />

                  <input
                    type="text"
                    className="input"
                    placeholder="Gunjan Yadav"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

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

              <button
                type="submit"
                className="auth-btn"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <LoaderIcon className="size-5 animate-spin mx-auto" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Login
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center border-l border-slate-800/50">
          <div className="max-w-lg text-center -mt-6">

            <img
              src="/signup.png"
              alt="Signup Illustration"
              className="w-[500px] mx-auto object-contain"
            />

            <h2 className="mt-8 text-5xl font-bold text-white">
              Start Your Journey Today
            </h2>

            <p className="mt-4 text-slate-400 text-lg leading-relaxed">
              Connect with friends, share ideas, and
              experience seamless communication.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="auth-badge">Free Forever</span>
              <span className="auth-badge">Easy Setup</span>
              <span className="auth-badge">Secure</span>
              <span className="auth-badge">Fast</span>
            </div>

          </div>
        </div>

      </div>
    </BorderAnimatedContainer>
  </div>
</div>
  );
}

export default SignUpPage;