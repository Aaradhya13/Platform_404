import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeProvider';
import { Youtube } from 'lucide-react';

const VideoSection = () => {
  const { theme } = useTheme();

  return (
    <div className="bg-white py-16 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/iC0PxZlVX_8?si=e9apUMWrViw23ltq"
                title="Kochi Metro Video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-6 text-center"
            >
              <a 
                href="https://www.youtube.com/@KochiMetroRail" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-poppins text-lg hover:scale-105 transition-transform duration-300"
              >
                <Youtube size={28} className="text-red-600" />
                <span className="text-black">
                  For More Videos Visit Our YouTube Channel
                </span>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-6 text-[#052f65]">
              About Kochi Metro
            </h2>

            <div className="space-y-4">
              <p className={`font-poppins text-lg leading-relaxed ${
                theme === 'dark' ? 'text-[#1f2021]' : 'text-[#495057]'
              }`}>
                Kochi Metro Rail Limited (KMRL) is Kerala's first metro rail system, connecting major destinations across Kochi with modern, efficient, and eco-friendly transportation.
              </p>

              <p className={`font-poppins text-lg leading-relaxed ${
                theme === 'dark' ? 'text-[#1f2021]' : 'text-[#495057]'
              }`}>
                Our 25.6 km network spans 22 stations, serving over 100,000 passengers daily with state-of-the-art technology and sustainable practices.
              </p>

              <p className={`font-poppins text-lg leading-relaxed ${
                theme === 'dark' ? 'text-[#1f2021]' : 'text-[#495057]'
              }`}>
                Experience seamless connectivity from Aluva to Ernakulam South, reducing travel time and contributing to a cleaner, greener Kochi.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
