import React from 'react';
import { motion } from 'framer-motion';
import { Train, MapPin, Clock, CreditCard, Smartphone, Route, Car, Shield, Building } from 'lucide-react';

const TravelGuide = () => {
  const guideItems = [
    {
      icon: Train,
      iconColor: 'bg-[#2D6A4F]',
      title: 'Metro Stations',
      description: 'Discover all 22 metro stations from Aluva to Ernakulam South with detailed information about facilities and connectivity.'
    },
    {
      icon: MapPin,
      iconColor: 'bg-[#6F2DA8]',
      title: 'Route Planning',
      description: 'Plan your journey efficiently with our interactive route planner and real-time schedule information.'
    },
    {
      icon: Clock,
      iconColor: 'bg-[#2D6A4F]',
      title: 'Timings & Schedule',
      description: 'Check metro timings, frequency, and service hours. First train at 5:30 AM, last train at 10:00 PM.'
    },
    {
      icon: CreditCard,
      iconColor: 'bg-[#6F2DA8]',
      title: 'Fare & Tickets',
      description: 'Learn about fare structure, smart cards, and digital payment options for a seamless travel experience.'
    },
    {
      icon: Smartphone,
      iconColor: 'bg-[#2D6A4F]',
      title: 'Mobile App',
      description: 'Download our official app for real-time updates, digital tickets, and personalized travel assistance.'
    },
    {
      icon: Route,
      iconColor: 'bg-[#6F2DA8]',
      title: 'Accessibility',
      description: 'Information about wheelchair accessibility, elevators, and facilities for passengers with special needs.'
    },
    {
      icon: Car,
      iconColor: 'bg-[#2D6A4F]',
      title: 'Parking',
      description: 'Details about parking facilities and rules for metro stations. Secure parking available at major stations.'
    },
    {
      icon: Shield,
      iconColor: 'bg-[#6F2DA8]',
      title: 'Safety Precautions',
      description: 'Important metro safety tips and guidelines for passengers. Follow safety protocols for a secure journey.'
    },
    {
      icon: Building,
      iconColor: 'bg-[#2D6A4F]',
      title: 'Facilities at Stations',
      description: 'Overview of amenities including restrooms, shops, ATMs, and waiting areas available at metro stations.'
    }
  ];

  return (
    <div className="bg-white py-16 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-[#003399] mb-4">
            TRAVEL GUIDE
          </h2>
          <p className="font-poppins text-lg text-[#212529] max-w-2xl mx-auto">
            Everything you need to know for a smooth and comfortable journey on Kochi Metro
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guideItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  y: -8,
                  rotateY: 3,
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
                  zIndex: 10
                }}
                whileTap={{ scale: 1.05 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer group relative overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 opacity-0 group-hover:opacity-100 rounded-xl"
                  transition={{ duration: 0.4 }}
                />

                <motion.div 
                  className={`relative z-10 w-16 h-16 ${item.iconColor} rounded-full flex items-center justify-center mb-4`}
                  whileHover={{ 
                    scale: [1, 1.2, 1.1],
                    rotate: [0, -5, 5, 0],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    whileHover={{
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 0.8 },
                      scale: { duration: 0.4, repeat: 1 }
                    }}
                  >
                    <IconComponent size={28} className="text-white" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white opacity-0 group-hover:opacity-60"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0, 0.6]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>

                <div className="relative z-10 space-y-4">
                  <motion.h3 
                    className="font-montserrat font-bold text-xl text-[#003399] group-hover:text-[#2D6A4F]"
                    whileHover={{ 
                      x: 8,
                      textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="font-poppins text-[#212529] leading-relaxed group-hover:text-gray-700"
                    whileHover={{ 
                      scale: 1.02,
                      opacity: 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.description}
                  </motion.p>
                </div>

                <motion.div
                  className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-b-[30px] border-l-transparent opacity-0 group-hover:opacity-100"
                  style={{
                    borderBottomColor: item.iconColor.includes('2D6A4F') ? '#2D6A4F' : '#6F2DA8'
                  }}
                  initial={{ scale: 0, rotate: 45 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4 }}
                />

                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                      style={{
                        top: `${20 + i * 25}%`,
                        right: `${10 + i * 15}%`
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TravelGuide;
