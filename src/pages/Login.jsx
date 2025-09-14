import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Lock } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server returned an invalid response (not JSON).");
      }

      if (
        res.ok &&
        data.token &&
        data.username &&
        data.role &&
        data.department
      ) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        localStorage.setItem("department", data.department);

        navigate("/dashboard");
      } else {
        throw new Error("Login unsuccessful. Please check your credentials.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
     
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ backgroundColor: '#003399' }}></div>
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" style={{ backgroundColor: '#2D6A4F' }}></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000" style={{ backgroundColor: '#95D5B2' }}></div>
      </div>

      
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/metro-bg.jpg)',
            filter: 'brightness(0.7)'
          }}
        ></div>
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 51, 153, 0.1)' }}></div>
        {/* Gradient transition to white */}
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-r from-transparent to-white"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <motion.h1 
            className="text-6xl font-bold mb-4 text-white" 
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              textShadow: '0 0 20px rgba(255,255,255,0.5)'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              textShadow: [
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 30px rgba(255,255,255,0.8)',
                '0 0 20px rgba(255,255,255,0.5)'
              ]
            }}
            transition={{ 
              duration: 0.8, 
              delay: 0.3,
              textShadow: { duration: 3, repeat: Infinity }
            }}
          >
            Platform 404
          </motion.h1>
          <motion.p 
            className="text-xl mb-6 text-white" 
            style={{ 
              fontFamily: 'Poppins, Roboto, sans-serif',
              textShadow: '0 0 10px rgba(255,255,255,0.5)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0
            }}
            transition={{ 
              duration: 0.6, 
              delay: 0.6
            }}
          >
            Digital Infrastructure Solutions
          </motion.p>
          
          <div className="flex justify-center">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <motion.div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#21B6C2' }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: 0,
                  ease: "easeInOut"
                }}
              ></motion.div>
              <motion.div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#95D5B2' }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: 0.5,
                  ease: "easeInOut"
                }}
              ></motion.div>
              <motion.div 
                className="w-3 h-3 rounded-full bg-white"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: 1,
                  ease: "easeInOut"
                }}
              ></motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

    
      <div className="flex-1 lg:w-1/2 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          <div className="backdrop-blur-lg rounded-3xl shadow-2xl border p-8 sm:p-10" style={{ backgroundColor: '#F4F6F8', borderColor: '#DEE2E6' }}>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden" style={{ backgroundColor: '#F4F6F8' }}>
                <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: '#003399' }}>
                Welcome Back
              </h2>
              <p className="mt-2" style={{ fontFamily: 'Poppins, Roboto, sans-serif', color: '#495057' }}>Sign in to your account</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: '#FFE6E6', borderColor: '#D62828', color: '#D62828', fontFamily: 'Poppins, Roboto, sans-serif' }}
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Poppins, Roboto, sans-serif', color: '#495057' }}>
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#495057' }} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{ 
                        backgroundColor: '#FFFFFF', 
                        borderColor: '#DEE2E6',
                        fontFamily: 'Poppins, Roboto, sans-serif',
                        color: '#495057'
                      }}
                      onFocus={(e) => e.target.style.ringColor = '#21B6C2'}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Poppins, Roboto, sans-serif', color: '#495057' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#495057' }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{ 
                        backgroundColor: '#FFFFFF', 
                        borderColor: '#DEE2E6',
                        fontFamily: 'Poppins, Roboto, sans-serif',
                        color: '#495057'
                      }}
                      onFocus={(e) => e.target.style.ringColor = '#21B6C2'}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                      style={{ color: '#495057' }}
                      onMouseEnter={(e) => e.target.style.color = '#212529'}
                      onMouseLeave={(e) => e.target.style.color = '#495057'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
                style={{ 
                  backgroundColor: '#21B6C2',
                  color: '#FFFFFF',
                  fontFamily: 'Poppins, Roboto, sans-serif',
                  focusRingColor: '#21B6C2'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1A9AA5'}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#21B6C2')}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
