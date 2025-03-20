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

  export interface Review {
    _id: string;
    buyerId: { name: string };
    productId: { name: string };
    rating: number;
    review: string;
    status?: string; // Optional, for pending/published status
    createdAt?: Date; // Optional, for creation timestamp
    imageUrl?: string; // Optional, for image upload
  }

  export interface AddReviewPageInterface {
    productId: string;
    buyerId: string;
  }

  export interface Order {
    farmerDetails: any;
    _id: string;
    productId: {
      name: string;
      price: number;
    };
    quantity: number;
    totalPrice: number;
    orderDate: string;
  }
  export interface OrderHistoryProps {
    userId: string;
  }