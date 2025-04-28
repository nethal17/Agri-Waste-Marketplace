"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Navbar } from "../components/Navbar"
import axios from "axios"
import { ShoppingCart, ArrowLeft, Trash2, ShoppingBag, Truck, CreditCard } from "lucide-react"

export const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const userData = JSON.parse(localStorage.getItem("user") || "{}")
  const userId = userData._id

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!userId) {
          toast.error("Please login to view your cart")
          navigate("/login")
          return
        }
        const response = await axios.get(`http://localhost:3000/api/cart/${userId}`)
        if (response.data) {
          setCartItems(response.data.items)
        }
      } catch (error) {
        console.error("Error fetching cart items:", error)
        toast.error("Failed to load cart items")
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [navigate])

  // Function to update item quantity
  const updateQuantity = async (wasteId, change) => {
    try {
      if (!userId) {
        toast.error("Please login to update cart")
        navigate("/login")
        return
      }

      const item = cartItems.find((item) => item.wasteId === wasteId)
      if (!item) return

      const newQuantity = item.quantity + change
      if (newQuantity < 1) {
        await removeItem(wasteId)
        return
      }

      const response = await axios.put("http://localhost:3000/api/cart/update", {
        userId,
        wasteId,
        quantity: newQuantity,
      })

      if (response.data) {
        setCartItems((prevItems) =>
          prevItems.map((item) => (item.wasteId === wasteId ? { ...item, quantity: newQuantity } : item)),
        )
        toast.success("Cart updated successfully")
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast.error("Failed to update cart")
    }
  }

  // Function to remove item from cart
  const removeItem = async (wasteId) => {
    try {
      if (!userId) {
        toast.error("Please login to remove items")
        navigate("/login")
        return
      }

      const response = await axios.delete("http://localhost:3000/api/cart/remove", {
        data: { userId, wasteId },
      })

      if (response.data) {
        setCartItems((prevItems) => prevItems.filter((item) => item.wasteId !== wasteId))
        toast.success("Item removed from cart")
      }
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error("Failed to remove item")
    }
  }

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity + item.deliveryCost)
    }, 0)
  }

  // Calculate subtotal (without delivery)
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  // Calculate total delivery cost
  const calculateDelivery = () => {
    return cartItems.reduce((total, item) => {
      return total + item.deliveryCost
    }, 0)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-b-2 border-green-600 rounded-full animate-spin"></div>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          <div className="container max-w-6xl px-4 py-16 mx-auto">
            <div className="flex flex-col items-center justify-center h-64 space-y-6">
              <div className="w-16 h-16 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
              <p className="text-lg font-medium text-green-700">Loading your cart...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Shopping Cart</h2>
          
          {cartItems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Subtotal</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Delivery Cost</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item.wasteId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-20 h-20">
                              {item.image ? (
                                <img
                                  className="object-cover w-20 h-20 rounded-md"
                                  src={item.image}
                                  alt={item.wasteItem}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-md">
                                  <span className="text-sm text-gray-500">No image</span>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container max-w-6xl px-4 py-12 mx-auto">
          <div className="flex items-center mb-8 space-x-2">
            <button
              onClick={() => navigate("/organic-waste")}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 transition-all duration-300 bg-green-100 rounded-full hover:bg-green-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="overflow-hidden bg-white shadow-md rounded-2xl">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
                      <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                        {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <div key={item.wasteId} className="p-6 transition-all duration-300 hover:bg-green-50">
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <div className="flex-shrink-0">
                            <div className="relative w-24 h-24 overflow-hidden bg-gray-100 sm:h-28 sm:w-28 rounded-xl">
                              {item.image ? (
                                <img
                                  className="object-cover w-full h-full"
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.wasteItem || "Product"}
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = "/images/no-image.png" // Fallback image
                                  }}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col justify-between flex-grow">
                            <div>
                              <div className="flex items-start justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">{item.wasteItem}</h3>
                                <div className="text-lg font-bold text-green-600">
                                  Rs. {(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                            </div>

                            <div className="flex flex-wrap items-end justify-between mt-4 gap-y-3">
                              <div className="px-3 py-1.5 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">Quantity: {item.quantity}</span>
                              </div>

                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <Truck className="w-4 h-4 mr-1 text-green-500" />
                                  <span>Delivery: Rs. {item.deliveryCost.toFixed(2)}</span>
                                </div>
                                <button
                                  onClick={() => removeItem(item.wasteId)}
                                  className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 transition-colors bg-red-50 rounded-lg hover:bg-red-100"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            
                            <span className="text-gray-700">{item.quantity}</span>
                            
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Rs. {item.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Rs. {(item.quantity * item.price).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Rs. {item.deliveryCost.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeItem(item.wasteId)}
                            className="text-red-600 transition-colors hover:text-red-900"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate('/organic-waste')}
                      className="px-6 py-3 text-gray-800 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Continue Shopping
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900">Rs. {calculateTotal().toFixed(2)}</p>
                    <button 
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="p-6 bg-white shadow-md rounded-2xl">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">Order Summary</h2>
                    <div className="space-y-3 text-gray-600">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium">Rs. {calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span className="font-medium">Rs. {calculateDelivery().toFixed(2)}</span>
                      </div>
                      <div className="pt-3 mt-3 border-t border-gray-200 border-dashed">
                        <div className="flex justify-between text-lg font-bold text-gray-800">
                          <span>Total</span>
                          <span className="text-green-600">Rs. {calculateTotal().toFixed(2)}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Taxes included where applicable</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/buyer-address-form")
                        toast.success("Proceeding to checkout...")
                      }}
                      className="px-6 py-3 mt-4 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                      className="flex items-center justify-center w-full px-6 py-3.5 mt-6 space-x-2 text-white transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-700 hover:shadow-lg focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="font-medium">Proceed to Checkout</span>
                    </button>

                    <button
                      onClick={() => navigate("/organic-waste")}
                      className="flex items-center justify-center w-full px-6 py-3 mt-3 space-x-2 text-green-700 transition-all duration-300 bg-white border border-green-600 rounded-lg hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Continue Shopping</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-2 text-sm text-gray-500">Start adding some items to your cart!</p>
              <button
                onClick={() => navigate('/organic-waste')}
                className="px-6 py-3 mt-6 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            <div className="p-12 text-center bg-white shadow-md rounded-2xl">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 text-green-500 bg-green-100 rounded-full">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-gray-800">Your cart is empty</h3>
              <p className="max-w-md mx-auto mb-8 text-gray-600">
                Looks like you haven't added any items to your cart yet. Start exploring our sustainable waste products!
              </p>
              <button
                onClick={() => navigate("/organic-waste")}
                className="inline-flex items-center px-6 py-3 font-medium text-white transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-700 hover:shadow-lg focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
