import React from 'react';

const BrandingBar = () => {
  return (
    <div className="bg-white h-12 sm:h-14 md:h-16 px-4">
      <div className="flex items-center justify-between h-full max-w-6xl mx-auto">
        {/* Left side - Logo and Brand Name */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <img 
            src="/logo.png"
            alt="Kochi Metro Rail Limited logo"
            className="h-6 sm:h-8 md:h-10 w-auto flex-shrink-0"
          />
          <div className="text-left">
            <h1 className="font-montserrat font-bold text-[#21B6C2] text-xs sm:text-sm md:text-lg leading-tight">
              കൊച്ചി മെട്രോ റെയിൽ ലിമിറ്റഡ്
            </h1>
            <p className="font-montserrat text-[#21B6C2] text-[10px] sm:text-xs md:text-sm">
              KOCHI METRO RAIL LIMITED
            </p>
          </div>
        </div>

        {/* Right side - Login and Signup buttons */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <a 
            href="/login"
            className="px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base font-montserrat font-medium text-[#21B6C2] border border-[#21B6C2] rounded-md hover:bg-[#21B6C2] hover:text-white transition-colors duration-200"
          >
            Login
          </a>
          <a 
            href="/signup"
            className="px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base font-montserrat font-medium text-white bg-[#21B6C2] rounded-md hover:bg-[#1a9ba5] transition-colors duration-200"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default BrandingBar;