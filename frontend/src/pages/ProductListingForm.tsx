import { useState } from "react";
import { toast } from "react-hot-toast";
import { FormData } from "../types";

const ProductListingForm = () => {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    description: "",
    price: "",
    quantity: "",
    expireDate: "",
    image: null,
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? (e.target as HTMLInputElement).files?.[0] || null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert price and quantity to numbers
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
          "Authorization": `Bearer ${token}`,
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
        value={formData.description}
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
