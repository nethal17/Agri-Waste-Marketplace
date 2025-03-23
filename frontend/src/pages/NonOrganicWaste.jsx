import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const nonOrganics = [
    { name: "Chemical Waste", image: "/images/Chemical_Waste.jpg", value: "Chemical Waste" }, 
    { name: "Plastic Waste", image: "/images/Plastic_Waste.jpg", value: "Plastic Waste" },  
    { name: "Metal Waste", image: "/images/Metal_Waste.jpg", value: "Metal Waste" },
    { name: "Fabric & Textile", image: "/images/Fabric_Textile_Waste.jpg", value: "Fabric Textile" }, 
    { name: "Glass & Ceramic", image: "/images/Glass_Ceramic_Waste.jpg", value: "Glass Ceramic" },
    { name: "Electronic & Electrical", image: "/images/Electronic_Electrical_Waste.jpg", value: "Electronic Electrical" },
    { name: "Rubber Waste", image: "/images/Rubber_Waste.jpg", value: "Rubber Waste" },
  ];

export const  NonOrganicWaste = () => {
  const navigate = useNavigate(); //
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWaste = nonOrganics.filter((waste) =>
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
        <div key={index} className="relative rounded-lg shadow-lg overflow-hidden"
        onClick={() => navigate(`/non-organic/${waste.value}`)}>
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


