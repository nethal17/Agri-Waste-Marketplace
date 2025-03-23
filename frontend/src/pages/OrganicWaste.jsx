import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const organicWastes = [
    { name: "Crop Residues", image: "/images/crop_residues.jpg", value: "Crop Residues" },
    { name: "Fruit & Vegetable", image: "/images/fruit_vegetable.jpg", value: "Fruit Vegetable" },
    { name: "Plantation Waste", image: "/images/plantation_waste.jpg", value: "Plantation Waste" },
    { name: "Nut & Seed Waste", image: "/images/nut_seed_waste.jpg", value: "Nut Seed Waste" },
    { name: "Livestock & Dairy Waste", image: "/images/livestock_dairy.jpg", value: "Livestock Dairy Waste" },
    { name: "Agro-Industrial Waste", image: "/images/agro_industrial.jpg", value: "Agro Industrial Waste" },
    { name: "Forestry Waste", image: "/images/forestry_waste.jpg", value: "Forestry Waste" }, 
  ];

export const  OrganicWaste = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  

  const filteredWaste = organicWastes.filter((waste) =>
    waste.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navbar />
    <br/> <br/>
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link to="/organic-waste">
          <button className="px-4 py-2 mr-2 text-white bg-black rounded">Organic Waste</button>
          </Link>
          <Link to="/non-organic">
          <button className="px-4 py-2 text-white bg-black rounded">Non-Organic Waste</button>
          </Link>
        </div>
        <input
          type="text"
          placeholder="Search Agri-Waste"
          className="w-1/3 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <br/> <br/>
      <div className="grid grid-cols-3 gap-4">
<<<<<<< Updated upstream

      {filteredWaste.map((waste, index) => (
        <div key={index} className="relative rounded-lg shadow-lg overflow-hidden"
        onClick={() => navigate(`/organic/${waste.value}`)}>
        <img src={waste.image} alt={waste.name} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-lg font-bold">{waste.name}</span>
        </div>
    </div>
  ))}
=======
        {filteredWaste.map((waste, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg shadow-lg">
            <img src={waste.image} alt={waste.name} className="object-cover w-full h-40" />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-lg font-bold text-white">{waste.name}</span>
            </div>
          </div>
        ))}
>>>>>>> Stashed changes
      </div>

    </div>
    </>
  );
};


