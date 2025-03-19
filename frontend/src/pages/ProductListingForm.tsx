// src/pages/ProductListingForm.tsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FormData } from "../types";

const ProductListingForm = () => {
  const [formData, setFormData] = useState<FormData>({
    farmerId: "", // Add farmerId
    productName: "",
    description: "",
    price: "",
    quantity: "",
    expireDate: "", 
    image: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert image to base64 (if needed)
      let photo = "";
      if (formData.image) {
        photo = await convertToBase64(formData.image);
      }

      // Prepare the payload
      const payload = {
        farmerId: formData.farmerId,
        productName: formData.productName,
        description: formData.description,
        price: parseFloat(formData.price), // Convert to number
        quantity: parseInt(formData.quantity, 10), // Convert to number
        expireDate: formData.expireDate,
        photo, // Base64 string or URL
      };

      console.log("Payload:", payload); // Debugging

      const response = await fetch("http://localhost:3000/api/inventory/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log("Response:", response);
      console.log("Response OK:", response.ok); // Debugging
      
      if (response.ok) {
        toast.success("Product submitted! Listing is under review.");
        setFormData({
          farmerId: "",
          productName: "",
          description: "",
          price: "",
          quantity: "",
          expireDate: "",
          image: null,
        });
      } else {
        const errorData = await response.json(); // Parse error response
        console.error("Error Data:", errorData); // Debugging
        toast.error(`Submission failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error); // Debugging
      toast.error("An error occurred. Please try again.");
    }
  };

  // Helper function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="farmerId"
        placeholder="Farmer ID"
        value={formData.farmerId}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="productName"
        placeholder="Product Name"
        value={formData.productName}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="date"
        name="expireDate"
        placeholder="Expire Date"
        value={formData.expireDate}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="file"
        name="image"
        onChange={handleChange}
        className="w-full p-2 border rounded"
        
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Product
      </button>
    </form>
  );
};

export default ProductListingForm;