import { useEffect } from "react";
import { useTheme } from "../context/ThemeProvider";

export default function TranslateWidget() {
  const { theme } = useTheme();

  useEffect(() => {
    // Define init globally before script loads
    window.googleTranslateElementInit = () => {
      if (!document.getElementById("google_translate_element")) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,es,fr,de,zh-CN,ar,ml,ta,te,kn",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );

      applyThemeStyles();
    };

    // Add script if not already present
    if (!document.querySelector("#google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script already loaded, just call init again
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    }

    return () => {
      // Only remove styles on cleanup
      const style = document.getElementById("translate-widget-theme-styles");
      if (style) style.remove();
    };
  }, []);

  const applyThemeStyles = () => {
    const style = document.createElement("style");
    style.id = "translate-widget-theme-styles";
    style.textContent = `
      .goog-te-banner-frame { display: none !important; }
      body { top: 0 !important; }

      #google_translate_element select,
      .goog-te-combo {
        pointer-events: auto !important;
        z-index: 9999 !important;
        position: relative !important;
      }

      .goog-te-combo {
        background: ${theme === "dark" ? "#374151" : "#f9fafb"} !important;
        color: ${theme === "dark" ? "#e5e7eb" : "#374151"} !important;
        border: 1px solid ${
          theme === "dark" ? "#6366f1" : "#c7d2fe"
        } !important;
        border-radius: 8px !important;
        padding: 6px 12px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
      }

      .goog-te-combo:hover {
        background: ${theme === "dark" ? "#4b5563" : "#f3f4f6"} !important;
        border-color: ${theme === "dark" ? "#818cf8" : "#a5b4fc"} !important;
      }

      .goog-logo-link, .goog-te-gadget span { display: none !important; }
      .goog-te-gadget { font-size: 0 !important; }
    `;

    const oldStyle = document.getElementById("translate-widget-theme-styles");
    if (oldStyle) oldStyle.remove();
    document.head.appendChild(style);
  };

  // Re-apply when theme changes
  useEffect(() => {
    const t = setTimeout(() => applyThemeStyles(), 200);
    return () => clearTimeout(t);
  }, [theme]);

  return <div id="google_translate_element" />;
}
