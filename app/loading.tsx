import React from "react";

const ApricusLoading = () => {
  return (
    <div className="fixed inset-0 bg-white w-screen h-screen flex flex-col items-center justify-center z-[9999] overflow-hidden">
      {/* Combined Logo and Text Container */}
      <div className="relative flex flex-col items-center">
        <div className="relative w-52 h-52 -mt-24">
          <img
            src="/logo-gif.gif"
            alt="Apricus Loading Animation"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text Content positioned to overlap with bottom of logo */}
        <div className="text-center -mt-16 md:-mt-8 z-10">
          <p className="text-lg font-comfortaaRegular text-primary/70">
            Loading your luxury experience...
          </p>
        </div>
      </div>

      {/* Optional: Additional decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-tl-full"></div>
      </div>
    </div>
  );
};

export default ApricusLoading;
