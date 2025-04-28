import { DeliveryOrder } from "../models/deliveryOrder.model.js";

// Get all delivery orders
export const getAllDeliveryOrders = async (req, res) => {
  try {
    const orders = await DeliveryOrder.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Accept an order (status stays 'toDeliver')
export const acceptOrder = async (req, res) => {
  try {
    const order = await DeliveryOrder.findByIdAndUpdate(
      req.params.id,
      { status: "toDeliver" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Decline an order (status stays 'toDeliver')
export const declineOrder = async (req, res) => {
  try {
    const order = await DeliveryOrder.findByIdAndUpdate(
      req.params.id,
      { status: "toDeliver" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};