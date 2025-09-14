// Navbar.jsx
import React from "react";
import { Globe, PlusCircle, MinusCircle, MapPin, Network } from "lucide-react";
import { useTranslation } from "../context/AppLayout";

const Navbar = ({ handleFontSize, toggleContrast }) => {
  const { language, translate, toggleLanguage } = useTranslation();

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow-md">
      <div className="flex items-center gap-6">
        {/* Custom Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 text-sm font-medium hover:text-purple-600"
        >
          <Globe size={18} />
          {language === "en" ? "English" : "മലയാളം"}
        </button>

        {/* Font Size Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFontSize("increase")}
            className="flex items-center gap-1 hover:text-purple-600"
          >
            <PlusCircle size={18} /> {translate("Fontsize")}
          </button>
          <button
            onClick={() => handleFontSize("decrease")}
            className="flex items-center gap-1 hover:text-purple-600"
          >
            <MinusCircle size={18} />
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleContrast}
          className="border px-2 py-1 rounded hover:bg-gray-200"
        >
          <span className="font-bold text-lg">A</span>
        </button>

        <button className="flex items-center gap-2 hover:text-purple-600">
          <MapPin size={18} /> {translate("Route Map")}
        </button>
        <button className="flex items-center gap-2 hover:text-purple-600">
          <Network size={18} /> {translate("Site Map")}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
