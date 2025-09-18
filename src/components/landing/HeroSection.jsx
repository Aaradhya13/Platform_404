import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeProvider';


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
            

          </div>
        </div>
      </div>

      <div className={`relative py-3 ticker-wrapper ${
        theme === 'dark' ? 'bg-[#1a8f9c]' : 'bg-[#21B6C2]'
      }`}>
        <div className="ticker-content text-white font-poppins font-bold text-sm">
          <span className="mr-16">🔧 Operations Dashboard - Monitor real-time system performance and maintenance schedules</span>
          <span className="mr-16">📊 Analytics & Reporting - Track operational efficiency and generate comprehensive reports</span>
          <span className="mr-16">🚇 Fleet Management - Oversee train operations, scheduling, and maintenance workflows</span>
          <span className="mr-16">⚡ System Monitoring - Real-time alerts for technical issues and operational updates</span>
          <span className="mr-16">👥 Staff Management - Coordinate cleaning, inspection, and maintenance teams efficiently</span>
          <span className="mr-16">🔧 Operations Dashboard - Monitor real-time system performance and maintenance schedules</span>
          <span className="mr-16">📊 Analytics & Reporting - Track operational efficiency and generate comprehensive reports</span>
          <span className="mr-16">🚇 Fleet Management - Oversee train operations, scheduling, and maintenance workflows</span>
          <span className="mr-16">⚡ System Monitoring - Real-time alerts for technical issues and operational updates</span>
          <span className="mr-16">👥 Staff Management - Coordinate cleaning, inspection, and maintenance teams efficiently</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
