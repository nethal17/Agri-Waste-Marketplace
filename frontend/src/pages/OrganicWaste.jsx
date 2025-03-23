import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

const organicWastes = [
    { name: "Crop Residues", image: "/images/crop_residues.jpg" },
    { name: "Fruit & Vegetable", image: "/images/fruit_vegetable.jpg" },
    { name: "Plantation Waste", image: "/images/plantation_waste.jpg" },
    { name: "Nut & Seed Waste", image: "/images/nut_seed_waste.jpg" },
    { name: "Livestock & Dairy Waste", image: "/images/livestock_dairy.jpg" },
    { name: "Agro-Industrial Waste", image: "/images/agro_industrial.jpg" },
    { name: "Forestry Waste", image: "/images/forestry_waste.jpg" }
  ];

export const  OrganicWaste = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWaste = organicWastes.filter((waste) =>
    waste.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navbar />
    <br/>
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Link to="/organic-waste">
          <button className="bg-black text-white px-4 py-2 mr-2 rounded">Organic Waste</button>
          </Link>
          <Link to="/non-organic">
          <button className="bg-black text-white px-4 py-2 rounded">Non-Organic Waste</button>
          </Link>
        </div>
        <input
          type="text"
          placeholder="Search Agri-Waste"
          className="border p-2 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filteredWaste.map((waste, index) => (
          <div key={index} className="relative rounded-lg shadow-lg overflow-hidden">
            <img src={waste.image} alt={waste.name} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-bold">{waste.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};


