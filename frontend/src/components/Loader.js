import React from "react";
import "tailwindcss/tailwind.css";

const Loader = () => {
  return (
    <div className="relative w-10 h-10 rotate-[165deg] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-transparent rounded-[0.25em] animate-before8" />
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-transparent rounded-[0.25em] animate-after6" />
    </div>
  );
};

export default Loader;

// Tailwind custom animations (add in tailwind.config.js)
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         before8: "before8 2s infinite",
//         after6: "after6 2s infinite",
//       },
//       keyframes: {
//         before8: {
//           '0%': { width: '0.5em', boxShadow: '1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75)' },
//           '35%': { width: '2.5em', boxShadow: '0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75)' },
//           '70%': { width: '0.5em', boxShadow: '-1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75)' },
//           '100%': { boxShadow: '1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75)' }
//         },
//         after6: {
//           '0%': { height: '0.5em', boxShadow: '0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75)' },
//           '35%': { height: '2.5em', boxShadow: '0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75)' },
//           '70%': { height: '0.5em', boxShadow: '0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75)' },
//           '100%': { boxShadow: '0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75)' }
//         },
//       },
//     },
//   },
//   plugins: [],
// };
