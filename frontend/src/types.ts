// src/types.ts
// src/types.ts
export interface Product {
    _id: string; // MongoDB uses _id by default
    farmerId: {
      _id: string;
      email: string;
    };
    productName: string;
    description: string;
    price: number;
    quantity: number;
    photo?: string; // URL for the product image
    expireDate: string;
    status: "pending" | "approved" | "rejected";
  }
  
  export interface FormData {
    productName: string;
    description: string;
    price: string;
    quantity: string;
    expireDate: string;
    image: File | null;
  }