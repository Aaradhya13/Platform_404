import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative">
      <div className="w-full h-32 bg-gradient-to-b from-gray-50 via-gray-200 to-[#232323]"></div>
      
      <div className="bg-[#232323] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-white">
                Kochi Metro Rail Limited
              </h3>
              <div className="space-y-2 font-poppins text-gray-300">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#D62828] mt-1 flex-shrink-0" />
                  <p className="text-sm leading-relaxed">
                    KMRL, 4th Floor,<br />
                    Revenue Tower, Park Avenue<br />
                    Kochi-682011, Kerala
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#D62828]" />
                  <a href="mailto:contactus@kmrl.co.in" className="text-sm hover:text-white transition-colors">
                    contactus@kmrl.co.in
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="font-montserrat font-bold text-xl text-white">Quick Links</h4>
              <ul className="space-y-2 font-poppins text-gray-300">
                {[
                  'Home',
                  'About Us',
                  'Route Map',
                  'Fare & Tickets',
                  'Sitemap',
                  'Copyright Policy',
                  'Hyperlinking Policy',
                  'Privacy Policy'
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-sm hover:text-[#D62828] transition-colors duration-200 flex items-center gap-1"
                    >
                      {link}
                      <ExternalLink size={12} className="opacity-0 hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <h4 className="font-montserrat font-bold text-xl text-white">Contact Us</h4>
                <div className="space-y-2 font-poppins text-gray-300">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-[#D62828]" />
                    <span className="text-sm">Helpline: </span>
                    <a href="tel:1800-425-1663" className="text-[#D62828] font-semibold hover:text-white transition-colors">
                      1800-425-1663
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-[#D62828]" />
                    <span className="text-sm">Office: </span>
                    <a href="tel:+91-484-2346800" className="text-white hover:text-[#D62828] transition-colors">
                      +91-484-2346800
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-montserrat font-bold text-xl text-white">RTI Information</h4>
                <div className="space-y-2 font-poppins text-gray-300 text-sm">
                  <p>Right to Information Officer</p>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[#D62828]" />
                    <a href="mailto:rti@kochimetro.org" className="hover:text-white transition-colors">
                      rti@kochimetro.org
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-montserrat font-bold text-lg text-white">Complaints</h4>
                <div className="font-poppins text-gray-300 text-sm">
                  <a href="mailto:complaints@kochimetro.org" className="hover:text-[#D62828] transition-colors">
                    complaints@kochimetro.org
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-gray-600"
          >
            <div className="text-center font-poppins text-gray-400 text-sm">
              <p>&copy; 2025 Kochi Metro Rail Limited. All rights reserved.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
