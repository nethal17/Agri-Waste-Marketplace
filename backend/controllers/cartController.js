import Cart from "../models/Cart.js";

//  Insert Item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, wasteId, description, price, deliveryCost, quantity } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    // Check if item exists
    const itemIndex = cart.items.findIndex(item => item.wasteId.toString() === wasteId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ wasteId, description, price, quantity, deliveryCost });
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity + item.deliveryCost,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

// Get cart items
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.wasteId");
    if (!cart) return res.status(404).json({ message: "Cart is empty" });
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

//  Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { userId, wasteId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const item = cart.items.find(item => item.wasteId.toString() === wasteId);
    if (item) item.quantity = quantity;
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity + item.deliveryCost,
      0
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to update item quantity" });
  }
};

//  Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const { userId, wasteId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.filter(item => item.wasteId.toString() !== wasteId);

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity + item.deliveryCost,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};