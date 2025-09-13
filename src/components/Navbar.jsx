// Navbar.jsx
import React, { useEffect, useState } from "react";
import { Globe, PlusCircle, MinusCircle, MapPin, Network } from "lucide-react";

const Navbar = ({ handleFontSize, toggleContrast }) => {
  const [language, setLanguage] = useState("en"); // track selected language

  useEffect(() => {
    // Load Google Translate script once
    if (!document.querySelector("#google-translate-script")) {
      const addScript = document.createElement("script");
      addScript.id = "google-translate-script";
      addScript.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(addScript);
    }

    // Init translate element (hidden)
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ml",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  // Function to manually change language using Google Translate's dropdown
  const handleLanguageToggle = () => {
    const newLang = language === "en" ? "ml" : "en";
    setLanguage(newLang);

    // Find Google Translate's hidden select dropdown
    const selectEl = document.querySelector(".goog-te-combo");
    if (selectEl) {
      selectEl.value = newLang;
      selectEl.dispatchEvent(new Event("change")); // trigger change
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow-md">
      <div className="flex items-center gap-6">
        {/* Custom Language Toggle Button */}
        <button
          onClick={handleLanguageToggle}
          className="flex items-center gap-2 text-sm font-medium hover:text-purple-600"
        >
          <Globe size={18} />
          {language === "en" ? "English" : "മലയാളം"}
        </button>

        {/* Hidden Google Translate Dropdown */}
        <div id="google_translate_element" style={{ display: "none" }}></div>

        {/* Font Size Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFontSize("increase")}
            className="flex items-center gap-1 hover:text-purple-600"
          >
            <PlusCircle size={18} /> Fontsize
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
          <MapPin size={18} /> Route Map
        </button>
        <button className="flex items-center gap-2 hover:text-purple-600">
          <Network size={18} /> Site Map
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
