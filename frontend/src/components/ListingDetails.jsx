import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";


export const ListingDetails = ({ farmerId }) => {

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          listings(null);
          toast.error("No token found, please login again.");
          return;
        }

        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const farmerId = userData._id;

        const response = await axios.get(`http://localhost:3000/api/products/farmer-listings/${farmerId}`);
        setListings(response.data);

      } catch (error) {
          console.error('Error fetching listings:', error);
        } finally {
          setLoading(false);
        }
        };
    
    fetchListings();
  }, [farmerId]);
    
  if (loading) {
    return <div>Loading...</div>;
  }

  const approvedProducts = listings.filter((inventory) => inventory.status === "approved");
    
  return (
    <div>
      {loading ? (
        <p className="text-center text-lg font-semibold">Loading listings...</p>
      ) : (
        <div className="w-full h-full p-6">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="border border-slate-600 rounded-md">No</th>
                <th className="border border-slate-600 rounded-md">Product Name</th>
                <th className="border border-slate-600 rounded-md max-md:hidden">Description</th>
                <th className="border border-slate-600 rounded-md">Price</th>
                <th className="border border-slate-600 rounded-md">Operations</th>
              </tr>
            </thead>

            <tbody>
              {approvedProducts.length > 0 ? (
                approvedProducts.map((product, index) => (
                  <tr key={product._id} className="h-8">
                    <td className="border border-slate-700 rounded-md text-center">
                      {index + 1}
                    </td>
                    <td className="border border-slate-700 rounded-md text-center">
                      {product.productName}
                    </td>
                    <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                      {product.description}
                    </td>
                    <td className="border border-slate-700 rounded-md text-center">
                      ${product.price}
                    </td>
                    <td className="border border-slate-700 rounded-md text-center">
                      <div className="flex justify-center gap-x-4">
                        <Link to={`http://localhost:3000/api/product/listings-details/${product._id}`}>
                          <BsInfoCircle className="text-2xl text-green-800" />
                        </Link>
                        <Link to={`http://localhost:3000/api/product/listings-delete/${product._id}`}>
                          <MdOutlineDelete className="text-2xl text-red-600" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No listings found for this farmer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
      
};
