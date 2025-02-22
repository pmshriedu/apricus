"use client";

const StringLights = () => {
  // Configuration for multiple light strings
  const stringConfigs = [
    { translateY: "0px", animationDelay: "0s" },
    { translateY: "20px", animationDelay: "0.3s" },
    { translateY: "10px", animationDelay: "0.6s" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stringConfigs.map((config, stringIndex) => (
        <div
          key={stringIndex}
          className="absolute w-full"
          style={{
            transform: `translateY(${config.translateY})`,
          }}
        >
          {/* String line */}
          <div
            className="absolute w-full border-t border-white/20"
            style={{
              top: `${stringIndex * 80}px`,
            }}
          />

          {/* Lights on the string */}
          <div
            className="flex justify-between absolute w-full"
            style={{
              top: `${stringIndex * 80 - 5}px`,
            }}
          >
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center"
                style={{
                  animation: `twinkle 1.5s infinite ${(
                    i * 0.2 +
                    parseFloat(config.animationDelay)
                  ).toFixed(1)}s`,
                }}
              >
                {/* Light bulb */}
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] relative">
                  {/* Glass reflection */}
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/90 rounded-full" />
                </div>
                {/* Small connector */}
                <div className="h-2 w-0.5 bg-white/40" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(0.95);
            filter: brightness(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1);
            filter: brightness(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default StringLights;
