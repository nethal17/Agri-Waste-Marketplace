import { useState } from "react";
import { toast } from "react-hot-toast";
import { FormData } from "../types";
import { Navbar } from "@/components/Navbar";

const ProductListingForm = () => {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    description: "",
    price: "",
    quantity: "",
    expireDate: "",
    image: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? (e.target as HTMLInputElement).files?.[0] || null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(formData.price);
    const quantity = parseInt(formData.quantity, 10);

    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Quantity must be a positive number.");
      return;
    }

    try {
      let photo = "";
      if (formData.image) {
        photo = await convertToBase64(formData.image);
      }

      const payload = {
        productName: formData.productName,
        description: formData.description,
        price,
        quantity,
        expireDate: formData.expireDate,
        photo,
      };

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please log in.");
        return;
      }

      const response = await fetch("http://localhost:3000/api/inventory/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Product submitted! Listing is under review.");
        setFormData({
          productName: "",
          description: "",
          price: "",
          quantity: "",
          expireDate: "",
          image: null,
        });
      } else {
        const errorData = await response.json();
        toast.error(`Submission failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-white px-4">
        <div className="w-full max-w-lg bg-gray-100 shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={formData.productName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              rows={4}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="date"
              name="expireDate"
              value={formData.expireDate}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <div className="w-full">
              <label className="block text-gray-700 font-medium mb-2">Upload Product Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg cursor-pointer bg-gray-100 file:bg-green-500 file:text-white file:py-2 file:px-4 file:border-none file:rounded-lg hover:file:bg-green-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all duration-200"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductListingForm;
