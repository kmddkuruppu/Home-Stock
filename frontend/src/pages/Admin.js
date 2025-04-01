import React from "react";
import Card from "../components/Card";

function App() {
  const cards = [
    { name: "Dinupa", title: "Special Feature", image: "../assets/images/", link: "/" },
    { name: "Udesha", title: "Shoppinglist Management", image: "../assets/images/", link: "/" },
    { name: "Chamodi", title: "Inventory Management", image: "../assets/images/chamodi.jpg", link: "/Inventory" },
    { name: "Dasun", title: "Budget Management", image: "../assets/images/dasun.jpg", link: "/Budget" },
    
  ];

  return (
    <div>
      <div className="w-full flex justify-center items-center mt-5">
        <p className="text-gray-400 text-3xl md:text-4xl font-bold uppercase text-center">
          Welcome to <span className="text-[var(--main-color)]">Home Stock </span> Admin Dashboard
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
        {cards.map((card, index) => (
          <Card key={index} name={card.name} title={card.title} image={card.image} link={card.link} />
        ))}
      </div>
    </div>
  );
}

export default App;
