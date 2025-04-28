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

const wasteItemsByType = {
  'Crop Residues': ['Wheat straw', 'Rice husk', 'Corn stalks', 'Lentil husks', 'Chickpea stalks', 'Pea pods','Mustard stalks', 'Sunflower husks', 'Groundnut shells'],
  'Fruit & Vegetable Waste': ['Banana peels', 'Orange pulp', 'Mango peels', 'Tomato skins', 'Potato peels', 'Carrot tops','Rotten tomatoes', 'Overripe bananas'],
  'Plantation Waste': ['Tea leaves', 'Coffee husk', 'Coffee pulp', 'Bagasse', 'Molasses', 'Cane tops','Coconut husks', 'Shells', 'Leaves'],
  'Nut & Seed Waste': ['Peanut Shells', 'Almond & Cashew Husks','Sesame & Flaxseed Waste'],
  'Livestock & Dairy Waste': ['Cow dung', 'Poultry droppings', 'Goat manure', 'Abattoir Waste (Bones, Blood, Skin leftovers)','Whey', 'Spoiled milk', 'Butter residue'],
  'Forestry Waste': ['Sawdust & Wood Chips', 'Bamboo Waste', 'Leaf & Bark Residue']
};

const CartButton = ({ itemCount }) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate('/cart')}
      className="relative group"
    >
      <div className="p-3 transition-transform transform bg-white rounded-full shadow-lg group-hover:scale-110 group-hover:shadow-xl">
        <div className="relative">
          <svg className="w-6 h-6 text-gray-700 transition-colors group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {itemCount > 0 && (
            <div className="absolute transition-all transform -top-2 -right-2 group-hover:scale-110">
              <div className="relative">
                <div className="absolute w-full h-full bg-green-500 rounded-full opacity-75 animate-ping"></div>
                <div className="relative flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-green-600 rounded-full">
                  {itemCount}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute px-2 py-1 text-sm text-white transition-opacity transform -translate-x-1/2 bg-gray-800 rounded opacity-0 -bottom-8 left-1/2 group-hover:opacity-100 whitespace-nowrap">
        View Cart
      </div>
    </button>
  );
};

// Component to display products for a specific category
const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWasteItem, setSelectedWasteItem] = useState('all');
  const [cartItemsCount, setCartItemsCount] = useState(0);
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

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userData._id;

      if (!token) {
        toast.error("No token found, please login again.");
        navigate("/login");
        return;
      }
      
      if (userId) {
        const response = await axios.get(`http://localhost:3000/api/cart/${userId}`);
        if (response.data) {
          setCartItemsCount(response.data.items.length);
        }
      }
      
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, []);

  const handleAddToCart = async (product) => {

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData._id;

    try {
      
      if (!userId) {
        toast.error('Please login to add items to cart');
        navigate('/login');
        return;
      }

      const cartItem = {
        userId,
        wasteId: product._id,
        description: product.wasteItem,
        price: product.price,
        quantity: 1,
        deliveryCost: 300 // You can modify this based on your requirements
      };

      const response = await axios.post('http://localhost:3000/api/cart/add', cartItem);
      
      if (response.data) {
        setCartItemsCount(prevCount => prevCount + 1);
        toast.success(`${product.wasteItem} added to cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const wasteItems = wasteItemsByType[category] || [];
  
  const filteredProducts = selectedWasteItem === 'all' 
    ? products 
    : products.filter(product => product.wasteItem === selectedWasteItem);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-b-2 border-green-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container px-4 py-8 mx-auto">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Link to="/organic-waste" className="inline-flex items-center text-green-600 transition-colors hover:text-green-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Categories
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">{category}</h1>
          </div>
          <CartButton itemCount={cartItemsCount} />
        </div>

        {/* Waste Items Filter */}
        {wasteItems.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedWasteItem('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedWasteItem === 'all'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                All Items
              </button>
              {wasteItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedWasteItem(item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedWasteItem === item
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="p-8 py-12 text-center bg-white shadow-lg rounded-xl">
            <p className="text-lg text-gray-600">
              {selectedWasteItem === 'all'
                ? 'No products available in this category.'
                : `No products available for ${selectedWasteItem}.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div key={product._id} className="flex flex-col h-full overflow-hidden transition-all duration-300 transform bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.wasteItem}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/no-image.png'; // Fallback image
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-0 right-0 px-3 py-1 text-white bg-green-600 rounded-bl-lg">
                    {product.quantity} kg
                  </div>
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex-grow">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{product.wasteItem}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-green-600">Rs. {product.price}</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <svg className="flex-shrink-0 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="truncate">{product.farmer?.name || product.farmerId?.name || 'Unknown Farmer'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="flex-shrink-0 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{product.location?.city || product.city}, {product.location?.district || product.district}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="flex-shrink-0 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">Expires: {new Date(product.expireDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center justify-center w-full px-4 py-3 mt-6 space-x-2 text-white transition-colors duration-300 bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Add to Cart</span>
                  </button>
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
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData._id;

        if (!token) {
          toast.error("No token found, please login again.");
          navigate("/login");
          return;
        }
      
        if (userId) {
          const response = await axios.get(`http://localhost:3000/api/cart/${userId}`);
          if (response.data) {
            setCartItemsCount(response.data.items.length);
          }
        }
        
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, []);

  const filteredWaste = organicWastes.filter((waste) =>
    waste.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container p-4 mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Link to="/organic-waste">
              <button className="px-4 py-2 text-white transition-colors bg-black rounded hover:bg-gray-800">
                Organic Waste
              </button>
            </Link>
            <Link to="/non-organic">
              <button className="px-4 py-2 text-white transition-colors bg-black rounded hover:bg-gray-800">
                Non-Organic Waste
              </button>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Agri-Waste"
                className="w-64 p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <CartButton itemCount={cartItemsCount} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWaste.map((waste, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden transition-transform transform rounded-lg shadow-lg cursor-pointer hover:scale-105"
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


