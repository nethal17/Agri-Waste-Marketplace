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
    { name: "Rubber Waste", image: "/images/Rubber_Waste.jpg", value: "Rubber Waste" }
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
      <br/><br/>
      <div className="grid grid-cols-3 gap-4">
      {filteredWaste.map((waste, index) => (
        <div key={index} className="relative overflow-hidden rounded-lg shadow-lg"
        onClick={() => navigate(`/non-organic/${waste.value}`)}>
        <img src={waste.image} alt={waste.name} className="object-cover w-full h-60" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-lg font-bold text-white">{waste.name}</span>
        </div>
    </div>
  ))}
      </div>
    </div>
    </>
  );
};


