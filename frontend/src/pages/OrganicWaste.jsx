import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const organicWastes = [
    { name: "Crop Residues", image: "/images/crop_residues.jpg", value: "Crop Residues" },
    { name: "Fruit & Vegetable", image: "/images/fruit_vegetable.jpg", value: "Fruit Vegetable" },
    { name: "Plantation Waste", image: "/images/plantation_waste.jpg", value: "Plantation Waste" },
    { name: "Nut & Seed Waste", image: "/images/nut_seed_waste.jpg", value: "Nut Seed Waste" },
    { name: "Livestock & Dairy Waste", image: "/images/livestock_dairy.jpg", value: "Livestock Dairy Waste" },
    { name: "Forestry Waste", image: "/images/forestry_waste.jpg", value: "Forestry Waste" }
];

// Component to display products for a specific category
const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products for category:', category);
        
        const response = await axios.get(`http://localhost:3000/api/marketplace/waste-type/${encodeURIComponent(category)}`);
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'No products found in this category');
        }
        
        console.log('API Response:', response.data);
        setProducts(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(`Failed to fetch products: ${err.message}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/organic-waste" className="inline-flex items-center text-green-600 hover:text-green-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 capitalize">{category}</h1>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.wasteItem}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No image available
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.wasteItem}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-semibold">Rs. {product.price}</span>
                    <span className="text-gray-500">{product.quantity} kg</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Location: {product.location.city}, {product.location.district}</p>
                    <p>Expires: {new Date(product.expireDate).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
                        cartItems.push(product);
                        localStorage.setItem("cart", JSON.stringify(cartItems));
                        toast.success(`${product.wasteItem} added to cart!`);
                      }}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const OrganicWaste = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredWaste = organicWastes.filter((waste) =>
    waste.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWaste.map((waste, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => navigate(`/organic/${waste.value}`)}
            >
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

export { CategoryProducts };


