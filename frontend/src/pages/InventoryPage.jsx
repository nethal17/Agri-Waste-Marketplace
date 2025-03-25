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
  'Livestock & Dairy Waste': ['Cow dung', 'Poultry droppings', 'Goat manure', 'Abattoir Waste (Bones, Blood, Skin leftovers)','Whey', 'Spoiled milk', 'Butter residue'],
  'Forestry Waste': ['Sawdust & Wood Chips', 'Bamboo Waste', 'Leaf & Bark Residue'],
  'Chemical Waste': ['Expired Pesticides & Herbicides','Fertilizer Residues','Disinfectants & Cleaning Agents'],
  'Plastic Waste': ['Pesticide & Fertilizer Packaging (Plastic bags, bottles, sachets)','Mulching Films & Plastic Sheets','Drip Irrigation Pipes & Tubes','Greenhouse Plastic Covers'],
  'Metal Waste': ['Rusty Farm Equipment & Tools (Plows, Harrows, Blades)','Wire Fencing & Metal Posts','Discarded Machinery Parts (Tractor parts, Gears, Bearings)'],
  'Fabric & Textile Waste': ['Burlap Sacks & Jute Bags','Tarpaulins & Netting Materials','Old Protective Gear (Gloves, Aprons, Coveralls)'],
  'Glass & Ceramic Waste': ['Chemical Containers','Pesticide Bottles','Damaged Ceramic Pots & Storage Jars'],
  'Rubber Waste': ['Used Tires from Tractors & Farm Vehicles','Rubber Seals & Hoses','Discarded Conveyor Belts']
};

// Function to map waste items to waste types
const getWasteType = (wasteItem) => {
  if (!wasteItem) return null;
  
  for (const [wasteType, items] of Object.entries(WASTE_TYPES)) {
    if (items.some(item => wasteItem.toLowerCase() === item.toLowerCase())) {
      return wasteType;
    }
  }
  return null;
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
      
      // Add wasteType to each listing and filter out null types
      const listingsWithTypes = data.map(listing => ({
        ...listing,
        wasteType: getWasteType(listing.wasteItem)
      })).filter(listing => listing.wasteType !== null);
      
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

  // Calculate waste type statistics only for existing types
  const wasteTypeStats = filteredListings.reduce((acc, listing) => {
    if (!listing.wasteType) return acc;
    
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

  // Get only waste types that have actual listings
  const existingWasteTypes = Object.keys(wasteTypeStats).filter(type => 
    wasteTypeStats[type].count > 0
  );

  // Prepare pie chart data with only existing types
  const pieData = {
    labels: existingWasteTypes,
    datasets: [
      {
        data: existingWasteTypes.map(type => wasteTypeStats[type].totalQuantity),
        backgroundColor: [
          "#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
          "#8AC24A", "#607D8B", "#E91E63", "#9C27B0", "#3F51B5", "#009688"
        ].slice(0, existingWasteTypes.length),
      },
    ],
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search waste types..."
            className="border border-gray-300 p-3 rounded-lg w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiBell className="text-3xl text-gray-600 cursor-pointer hover:text-gray-900 transition" />
        </div>

        {/* Stats cards section - only shown when not searching */}
        {!searchTerm && (
          <div className="grid grid-cols-6 gap-4 mb-8">
            {existingWasteTypes.slice(0, 6).map((wasteType) => (
              <div key={wasteType} className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-gray-800 truncate" title={wasteType}>
                  {wasteType}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Items: {wasteTypeStats[wasteType].count}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {wasteTypeStats[wasteType].totalQuantity} KG
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> {/* Changed to responsive grid */}
          {/* Main table section - now always takes full width when searching */}
          <div className={searchTerm ? "col-span-1 lg:col-span-3" : "col-span-1 lg:col-span-2"}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Inventory Details</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-auto h-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="p-4 text-left text-gray-700 font-medium">Waste Type</th>
                    <th className="p-4 text-left text-gray-700 font-medium">Waste Item</th>
                    <th className="p-4 text-left text-gray-700 font-medium">Description</th>
                    <th className="p-4 text-left text-gray-700 font-medium">District</th>
                    <th className="p-4 text-left text-gray-700 font-medium">Price (per KG)</th>
                    <th className="p-4 text-left text-gray-700 font-medium">Quantity (KG)</th>
                    <th className="p-4 text-left text-gray-700 font-medium">Expire Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4 text-gray-800 font-medium">{listing.wasteType}</td>
                      <td className="p-4 text-gray-700">{listing.wasteItem}</td>
                      <td className="p-4 text-gray-700 max-w-xs">{listing.description}</td>
                      <td className="p-4 text-gray-700">{listing.district}</td>
                      <td className="p-4 text-green-600 font-semibold">Rs.{listing.price}</td>
                      <td className="p-4 text-gray-700">{listing.quantity} KG</td>
                      <td className="p-4 text-gray-700">{new Date(listing.expireDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredListings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No listings found matching your search
                </div>
              )}
            </div>
          </div>

          {/* Pie chart section - hidden when searching */}
          {!searchTerm && existingWasteTypes.length > 0 && (
            <div className="col-span-1 p-2 bg-white rounded-lg shadow-sm border border-gray-200"> 
              <h2 className="text-xl font-bold text-gray-800 mb-3">Waste Distribution</h2> 
              <div className="h-[400px]"> 
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
                          boxWidth: 10, 
                          padding: 15,
                          font: {
                            size: 11 
                          }
                        }
                      }
                    },
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};