import React from 'react';
import { motion } from 'framer-motion';

const MetroAttractions = () => {
  const attractions = [
    {
      name: 'Lulu Mall',
      image: 'https://www.kochi.lulumall.in/wp-content/uploads/2025/05/Lulu-aerial-V-1.jpg',
      link: 'https://www.kochi.lulumall.in/'
    },
    {
      name: 'Marine Drive',
      image: 'https://www.explorebees.com/uploads/Marine%20Drive%20Kochi%20(7).jpg',
      link: 'https://www.keralatourism.org/destination/marine-drive-kochi/546/'
    },
    {
      name: 'Fort Kochi',
      image: 'https://c.ndtvimg.com/2025-03/qi8ql9j_fort-kochi_625x300_23_March_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307',
      link: 'https://www.keralatourism.org/destination/fort-kochi/422/'
    },
    {
      name: 'Wonderla',
      image: 'https://b3681537.smushcdn.com/3681537/wp-content/uploads/2022/10/wonderla-amusement-park-kochi.jpg?lossy=2&strip=1&webp=1',
      link: 'https://www.wonderla.com/kochi'
    },
    {
      name: 'Cherai Beach',
      image: 'https://www.keralatourism.org/_next/image/?url=http%3A%2F%2F127.0.0.1%2Fktadmin%2Fimg%2Fpages%2Ftablet%2Fcherai-beach-1728570752_384a8191992d3fc60b77.webp&w=1920&q=75',
      link: 'https://www.keralatourism.org/destination/cherai-beach-kochi/179/'
    },
    {
      name: 'Hill Palace',
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhLiJ4mhhauzlFhqV14ZPZF-UjY-bjSy7xxpq0D89kaP-OGOqidKS03ENNBZZIXOPZvPm9rt0FbugcuYE0rhoAVwhEhvgmVDV5v6WOO6WXTA99VvWZWP7buF8H-lPcswj8niLsbtRoIsSpG/s720/hill_palace_museum_thripunithura20131031104553_182_1.jpg',
      link: 'https://www.keralatourism.org/destination/hill-palace-museum/182/'
    }
  ];

  return (
    <div className="bg-gray-50 py-16 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-[#003399] mb-4">
            Metro Attractions
          </h2>
          <p className="font-poppins text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing destinations easily accessible via Kochi Metro
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {attractions.map((attraction, index) => (
            <motion.a
              key={index}
              href={attraction.link}
              target="_blank"
              rel="noopener noreferrer"
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
                y: -5
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer block relative group"
            >
              <motion.div
                className="absolute top-4 right-4 w-10 h-10 bg-[#003399] rounded-full flex items-center justify-center shadow-lg z-10"
                whileHover={{ scale: 1.1, rotate: 15 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z"></path>
                </svg>
              </motion.div>

              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-[#003399] opacity-20"
                animate={{ 
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
           
              <div className="flex justify-center mb-4">
                <motion.div
                  className="relative w-56 h-56"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div 
                    className="w-full h-full transform rotate-45 overflow-hidden shadow-lg"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                    }}
                  >
                    <motion.img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-full object-cover transform -rotate-45 scale-150"
                      whileHover={{ 
                        scale: 1.6,
                        rotate: 2
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  
                  <motion.div 
                    className="absolute inset-0 transform rotate-45 bg-gradient-to-br from-blue-200/30 to-purple-200/30 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                    }}
                  />
                </motion.div>
              </div>

              <motion.h3 
                className="font-montserrat font-bold text-xl text-[#003399] text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {attraction.name}
              </motion.h3>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetroAttractions;
