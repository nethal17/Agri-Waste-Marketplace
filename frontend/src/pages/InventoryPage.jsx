import { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { Navbar } from "../components/Navbar";

// Define the 12 waste types and their possible waste items
const WASTE_TYPES = {
  'Crop Residues': ['Wheat straw', 'Rice husk', 'Corn stalks', 'Lentil husks', 'Chickpea stalks', 'Pea pods','Mustard stalks', 'Sunflower husks', 'Groundnut shells'],
  'Fruit & Vegetable Waste': ['Banana peels', 'Orange pulp', 'Mango peels', 'Tomato skins', 'Potato peels', 'Carrot tops','Rotten tomatoes', 'Overripe bananas'],
  'Plantation Waste': ['Tea leaves', 'Coffee husk', 'Coffee pulp', 'Bagasse', 'Molasses', 'Cane tops','Coconut husks', 'Shells', 'Leaves'],
  'Nut & Seed Waste': ['Peanut Shells', 'Almond & Cashew Husks','Sesame & Flaxseed Waste'],
  'Livestock & Dairy Waste': [' Cow dung', 'Poultry droppings', 'Goat manure', 'Bones', 'Blood', 'Skin leftovers','Whey', 'Spoiled milk', 'Butter residue'],
  'Forestry Waste': ['Sawdust & Wood Chips', 'Bamboo Waste', 'Leaf & Bark Residue'],
  'Chemical Waste': ['Expired Pesticides & Herbicides','Fertilizer Residues','Disinfectants & Cleaning Agents'],
  'Plastic Waste': ['Plastic bags','bottles','sachets','Mulching Films & Plastic Sheets','Drip Irrigation Pipes & Tubes','Greenhouse Plastic Covers'],
  'Metal Waste': ['Plows','Harrows','Blades','Wire Fencing & Metal Posts','Tractor parts','Gears','Bearings'],
  'Fabric & Textile Waste': ['Burlap Sacks & Jute Bags','Tarpaulins & Netting Materials','Gloves','Aprons','Coveralls'],
  'Glass & Ceramic Waste': ['Chemical Containers','Pesticide Bottles','Damaged Ceramic Pots & Storage Jars'],
  'Rubber Waste': ['Tires','Hoses','Conveyor Belts','Rubber Mats']
};

// Function to map waste items to waste types
const getWasteType = (wasteItem) => {
  for (const [wasteType, items] of Object.entries(WASTE_TYPES)) {
    if (items.some(item => wasteItem.includes(item))) {
      return wasteType;
    }
  }
  return ; // Default category
};

export const InventoryPage = () => {
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMarketplaceListings();
  }, []);

  const fetchMarketplaceListings = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/marketplace/listings");
      if (!response.ok) {
        throw new Error("Failed to fetch marketplace listings.");
      }
      const data = await response.json();
      
      // Add wasteType to each listing
      const listingsWithTypes = data.map(listing => ({
        ...listing,
        wasteType: getWasteType(listing.wasteItem)
      }));
      
      setMarketplaceListings(listingsWithTypes);
    } catch (error) {
      setError(error.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Filter listings based on search term
  const filteredListings = marketplaceListings.filter(listing => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (listing.wasteType && listing.wasteType.toLowerCase().includes(searchLower)) 
    );
  });

  // Calculate waste type statistics
  const wasteTypeStats = filteredListings.reduce((acc, listing) => {
    if (!acc[listing.wasteType]) {
      acc[listing.wasteType] = {
        count: 0,
        totalQuantity: 0
      };
    }
    acc[listing.wasteType].count += 1;
    acc[listing.wasteType].totalQuantity += listing.quantity;
    return acc;
  }, {});

  // Prepare pie chart data
  const pieData = {
    labels: Object.keys(wasteTypeStats),
    datasets: [
      {
        data: Object.values(wasteTypeStats).map(w => w.totalQuantity),
        backgroundColor: [
          "#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
          "#8AC24A", "#607D8B", "#E91E63", "#9C27B0", "#3F51B5", "#009688"
        ].slice(0, Object.keys(wasteTypeStats).length),
      },
    ],
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search marketplace..."
            className="border p-3 rounded-lg w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiBell className="text-3xl text-gray-600 cursor-pointer hover:text-gray-900 transition" />
        </div>

        {/* Only show stats cards when not searching */}
        {!searchTerm && (
          <div className="grid grid-cols-4 gap-6 mb-6">
            {Object.entries(wasteTypeStats).slice(0, 4).map(([wasteType, stats]) => (
              <div key={wasteType} className="p-6 border rounded-lg shadow-md bg-white hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-700 truncate" title={wasteType}>
                  {wasteType}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Items: {stats.count}</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {stats.totalQuantity} KG
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className={searchTerm ? "col-span-3" : "col-span-2"}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Marketplace Listings</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 overflow-auto h-96">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-gray-200">
                    <th className="p-3 text-gray-700">Waste Type</th>
                    <th className="p-3 text-gray-700">Waste Item</th>
                    <th className="p-3 text-gray-700">Description</th>
                    <th className="p-3 text-gray-700">District</th>
                    <th className="p-3 text-gray-700">Price (per KG)</th>
                    <th className="p-3 text-gray-700">Quantity (KG)</th>
                    <th className="p-3 text-gray-700">Expire Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing._id} className="border-b hover:bg-gray-100 transition">
                      <td className="p-3 font-medium">{listing.wasteType}</td>
                      <td className="p-3">{listing.wasteItem}</td>
                      <td className="p-3">{listing.description}</td>
                      <td className="p-3">{listing.district}</td>
                      <td className="p-3 font-semibold text-green-600">${listing.price}</td>
                      <td className="p-3">{listing.quantity} KG</td>
                      <td className="p-3">{new Date(listing.expireDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!searchTerm && (
            <div className="p-6 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Types Chart</h2>
            <Pie 
              data={pieData} 
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.label}: ${context.raw} KG`;
                      }
                    }
                  },
                  legend: {
                    position: 'right',
                    labels: {
                      boxWidth: 12,
                      padding: 20
                    }
                  }
                }
              }}
            />
          </div>
          )}
        </div>
      </div>
    </>
  );
};