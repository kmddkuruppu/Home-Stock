import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ name, title, image, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <div className="w-[250px] h-[300px] bg-black border-2 border-white shadow-[4px_4px_0px_#fff] rounded-md flex flex-col items-center justify-center transition-all">
      <div
        className="w-[150px] h-[150px] bg-gray-300 bg-cover bg-center rounded-full mb-3 hover:scale-50 transition-transform duration-300"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className="text-white text-lg font-medium text-center">
        {name} <br />
        <span className="text-gray-400 text-sm">{title}</span>
      </div>
      <button
        type="button"
        className="relative mt-5 px-5 py-2 font-bold text-white uppercase tracking-wider transition-all border-none bg-transparent overflow-hidden hover:bg-white hover:text-black rounded-md"
        onClick={handleClick}
      >
        <span className="absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent to-white animate-[slideRight_1.5s_linear_infinite]"></span>
        <span className="absolute top-[-100%] right-0 w-[2px] h-full bg-gradient-to-b from-transparent to-white animate-[slideDown_1.5s_linear_infinite] delay-[0.375s]"></span>
        <span className="absolute bottom-0 right-[-100%] w-full h-[2px] bg-gradient-to-l from-transparent to-white animate-[slideLeft_1.5s_linear_infinite] delay-[0.75s]"></span>
        <span className="absolute bottom-[-100%] left-0 w-[2px] h-full bg-gradient-to-t from-transparent to-white animate-[slideUp_1.5s_linear_infinite] delay-[1.125s]"></span>
        View
      </button>
    </div>
  );
};

export default Card;
