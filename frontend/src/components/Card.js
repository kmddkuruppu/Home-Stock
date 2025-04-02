import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ name, title, icon, link, bgColor, image, accentColor = "purple" }) => {
  const navigate = useNavigate();

  // Default images for each team member
  const teamImages = {
    Dinupa: "../assets/images/",
    Udesha: "../assets/images/",
    Chamodi: "../assets/images/chamodi.jpg",
    Dasun: "../assets/images/dasun.jpg",
  };

  // Use the provided image or fall back to the team member's default image
  const displayImage = image || teamImages[name] || null;

  const handleClick = () => {
    navigate(link);
  };

  // Color mapping for different accent colors
  const colorVariants = {
    purple: {
      border: "border-purple-400",
      text: "text-purple-400",
      bg: "bg-purple-400",
      gradient: "from-purple-500/30",
      hoverText: "group-hover:text-purple-300",
      hoverBorder: "group-hover:border-purple-400"
    },
    blue: {
      border: "border-blue-400",
      text: "text-blue-400",
      bg: "bg-blue-400",
      gradient: "from-blue-500/30",
      hoverText: "group-hover:text-blue-300",
      hoverBorder: "group-hover:border-blue-400"
    },
    emerald: {
      border: "border-emerald-400",
      text: "text-emerald-400",
      bg: "bg-emerald-400",
      gradient: "from-emerald-500/30",
      hoverText: "group-hover:text-emerald-300",
      hoverBorder: "group-hover:border-emerald-400"
    },
    amber: {
      border: "border-amber-400",
      text: "text-amber-400",
      bg: "bg-amber-400",
      gradient: "from-amber-500/30",
      hoverText: "group-hover:text-amber-300",
      hoverBorder: "group-hover:border-amber-400"
    }
  };

  return (
    <div className={`${bgColor} relative group h-80 w-full rounded-xl p-6 overflow-hidden border border-gray-700 shadow-lg transition-all duration-500 hover:shadow-2xl hover:translate-y-[-5px]`}>
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-${accentColor}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10 [mask-image:linear-gradient(to_bottom,transparent,black)]">
        <div className="absolute inset-0 bg-[size:20px_20px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.3)_1px,transparent_1px)]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between">
        {/* Profile image with futuristic frame */}
        <div className="relative w-32 h-32 mb-4 group-hover:scale-105 transition-transform duration-300">
          <div className={`absolute inset-0 rounded-full border-2 ${colorVariants[accentColor].border}/50 ${colorVariants[accentColor].hoverBorder} transition-all duration-300`}></div>
          <div className={`absolute inset-0 rounded-full border-4 border-transparent ${colorVariants[accentColor].hoverBorder}/20 transition-all duration-300 animate-spin-slow [animation-delay:-2s]`}></div>
          <div className={`absolute inset-0 rounded-full border-4 border-transparent ${colorVariants[accentColor].hoverBorder}/20 transition-all duration-300 animate-spin-slow [animation-delay:-4s]`}></div>
          
          <div 
            className="w-full h-full rounded-full bg-cover bg-center border-2 border-gray-700 shadow-inner overflow-hidden"
            style={{ 
              backgroundImage: displayImage ? `url(${displayImage})` : 'none',
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
          >
            {/* Fallback if image doesn't load */}
            {!displayImage && (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <span className={`text-4xl font-bold ${colorVariants[accentColor].text}`}>{name.charAt(0)}</span>
              </div>
            )}
          </div>
          
          {/* Icon badge */}
          <div className={`absolute -bottom-2 right-2 w-10 h-10 rounded-full bg-gray-900 border-2 ${colorVariants[accentColor].border} flex items-center justify-center shadow-lg`}>
            {React.cloneElement(icon, { className: `${colorVariants[accentColor].text} text-xl` })}
          </div>
        </div>
        
        {/* Text content */}
        <div className="text-center w-full">
          {/* Name with animated underline */}
          <h3 className="text-2xl font-bold text-white mb-1">
            {name}
            <span className={`block w-0 h-0.5 ${colorVariants[accentColor].bg} mt-1 mx-auto transition-all duration-500 group-hover:w-3/4`}></span>
          </h3>
          
          {/* Title with subtle animation */}
          <p className={`text-gray-300 text-sm font-medium transition-all duration-300 ${colorVariants[accentColor].hoverText} mb-4`}>
            {title}
          </p>
        </div>
        
        {/* Holographic button */}
        <button
          onClick={handleClick}
          className={`relative px-6 py-2 bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-600 overflow-hidden ${colorVariants[accentColor].hoverBorder} transition-all duration-300 w-fit`}
        >
          <span className="relative z-10 text-white font-medium flex items-center">
            View Dashboard
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 ${colorVariants[accentColor].text}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
          <span className={`absolute inset-0 bg-gradient-to-r ${colorVariants[accentColor].gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></span>
        </button>
      </div>
      
      {/* Corner accents */}
      <div className={`absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 ${colorVariants[accentColor].border} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 ${colorVariants[accentColor].border} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </div>
  );
};

export default Card;