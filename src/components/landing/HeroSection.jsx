import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeProvider';
import { CreditCard, Download } from 'lucide-react';

const HeroSection = () => {
  const { theme } = useTheme();

  return (
    <div className="relative">
      <div 
        className="relative h-[500px] bg-gradient-to-r from-blue-900 to-blue-700 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('/metro-bg.jpg')",
          backgroundColor: '#1e3a8a'
        }}
      >
        <div className="relative z-20 h-full flex items-center justify-center px-6 md:px-12">
          <div className="text-center max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight"
            >
              Welcome to{' '}
              <motion.span 
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight"
              >
                Kochi Metro
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={`font-poppins text-lg md:text-xl mb-8 leading-relaxed ${
                theme === 'dark' ? 'text-[#CED4DA]' : 'text-white'
              }`}
            >
              Experience fast, reliable, and eco-friendly transportation with our modern metro system
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-8 py-4 text-white font-poppins font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-[#19a3ad] hover:bg-[#1a8f9c]' 
                    : 'bg-[#21B6C2] hover:bg-[#1a8f9c]'
                }`}
              >
                <CreditCard size={20} />
                Smart Card Top Up
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-poppins font-semibold rounded-lg shadow-lg transition-all duration-300"
              >
                <Download size={20} />
                Download App
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className={`relative py-3 ticker-wrapper ${
        theme === 'dark' ? 'bg-[#1a8f9c]' : 'bg-[#21B6C2]'
      }`}>
        <div className="ticker-content text-white font-poppins font-bold text-sm">
          <span className="mr-16">🚇 New metro timings: First train 5:30 AM, Last train 10:00 PM</span>
          <span className="mr-16">📱 Download our mobile app for real-time updates and digital tickets</span>
          <span className="mr-16">🎫 Monthly pass discount available - Save up to 20% on travel costs</span>
          <span className="mr-16">🔧 Weekend maintenance schedule - Check alternate routes on our website</span>
          <span className="mr-16">🚨 Emergency helpline: 1800-425-1663 available 24/7 for passenger assistance</span>
          <span className="mr-16">🚇 New metro timings: First train 5:30 AM, Last train 10:00 PM</span>
          <span className="mr-16">📱 Download our mobile app for real-time updates and digital tickets</span>
          <span className="mr-16">🎫 Monthly pass discount available - Save up to 20% on travel costs</span>
          <span className="mr-16">🔧 Weekend maintenance schedule - Check alternate routes on our website</span>
          <span className="mr-16">🚨 Emergency helpline: 1800-425-1663 available 24/7 for passenger assistance</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
