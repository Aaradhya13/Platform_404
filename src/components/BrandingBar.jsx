import React from 'react';

const BrandingBar = () => {
  return (
    <div className="bg-white h-12 sm:h-14 md:h-16 px-4">
      <div className="flex items-center justify-center h-full max-w-6xl mx-auto gap-3 sm:gap-4 md:gap-6">
        <img 
          src="/logo.png" 
          alt="Kochi Metro Rail Limited logo"
          className="h-6 sm:h-8 md:h-10 w-auto flex-shrink-0"
        />
        <div className="text-center">
          <h1 className="font-montserrat font-bold text-[#21B6C2] text-xs sm:text-sm md:text-lg leading-tight">
           കൊച്ചി മെട്രോ റെയിൽ ലിമിറ്റഡ്
          </h1>
          <p className="font-montserrat text-[#21B6C2] text-[10px] sm:text-xs md:text-sm">
          KOCHI METRO RAIL LIMITED
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandingBar;
