import OrderHistory from "../models/orderHistory.model.js"; 

//Add Order History
export const addOrderHistory = async (req, res) => {
  try {
    const newOrder = new OrderHistory(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Failed to add order" });
  }
};

// 🧹 Get Order History by User
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await OrderHistory.find({ userId }).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

//Cancel Order (Delete)
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    await OrderHistory.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};




export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID.' });
    }

    const order = await OrderHistory.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ message: 'Order updated successfully.', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
