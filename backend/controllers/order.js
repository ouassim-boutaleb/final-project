const db = require("../db/models/index");
const {
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("../errors");
require("dotenv").config();
const asyncWrapper = require("../middlewares/async");
const { StatusCodes } = require("http-status-codes");
const { createPayment } = require("../utils/chargilyService");

const placeOrder = asyncWrapper(async (req, res) => {
  const { id: userId, email, firstname, lastname, phoneNumber } = req.user;
  const {  paymentMethod } = req.body;
  const name = `${firstname} ${lastname}`;
  const address = req.user.address;

  if (!["credit_card", "cash_on_delivery"].includes(paymentMethod)) {
    throw new BadRequestError("Invalid payment method");
  }

  if (!phoneNumber) {
    throw new BadRequestError("Please provide a phone number");
  }

  const cart = await db.Cart.findOne({
    where: { userId },
    include: [{ model: db.CartItem, as: "cartItems" }],
  });

  if (!cart || cart.cartItems.length === 0) {
    throw new BadRequestError("No items in cart");
  }

  let totalAmount = 0;
  let warehouseId = null;
  const checkoutItems = [];

  for (const item of cart.cartItems) {
    const product = await db.Product.findByPk(item.productId);
    if (!product) throw new NotFoundError("Product not found");

    if (!warehouseId) warehouseId = product.warehouseId;

    totalAmount += product.price * item.quantity;

    checkoutItems.push({
      id: product.id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      description: product.description,
    });
  }

  // Step 1: Create the order first — but mark it pending
  const order = await db.Order.create({
    userId,
    warehouseId,
    totalAmount,
    paymentMethod,
  });

  try {
    for (const item of cart.cartItems) {
      const product = await db.Product.findByPk(item.productId);

      // Check if there's enough stock
      if (product.stock < item.quantity) {
        throw new BadRequestError(`Not enough stock for ${product.name}`);
      }

      // Create order item
      await db.OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
        color: item.color,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
      if (product.stock < 10) {
        const io = req.app.get("io");
        io.to(`user_${product.warehouseId}`).emit("low-stock", {
          productId: product.id,
          name: product.name,
          remainingStock: product.stock,
          message: `Low stock alert: ${product.name} only has ${product.stock} left!`,
        });
        await db.Notification.create({
          userId: product.warehouseId,
          shopId: req.user.id,
          message: `Low stock alert: ${product.name} only has ${product.stock} left!`,
        });
        console.log(
          `📉 Low stock notification sent for ${product.name} (warehouse: ${product.warehouseId})`
        );
      }
    }

    await db.CartItem.destroy({ where: { cartId: cart.id } });

    let payment = null;

    if (paymentMethod === "credit_card") {
      payment = await createPayment({
        amount: totalAmount,
        email,
        name,
        phone: phoneNumber,
        orderId: order.id, // you need it here
        items: checkoutItems,
      });

      if (!payment || !payment.checkout_url) {
        throw new Error("Payment failed to initialize");
      }
    }
    console.log(warehouseId)
    const io = req.app.get("io");
    const message = "A new order has been placed for your warehouse!";
    io.to(`user_${warehouseId}`).emit("new-order", {
      orderId: order.id,
      userId,
      totalAmount,
      createdAt: order.createdAt,
      message,
    });
    await db.Notification.create({
      userId: warehouseId,
      shopId: req.user.id,
      message,
    });
    return res
      .status(StatusCodes.CREATED)
      .json(
        payment
          ? { order, paymentUrl: payment.checkout_url }
          : { order, message: "Order placed with Cash on Delivery" }
      );
  } catch (error) {
    // Rollback if something goes wrong
    console.error("❌ Rolling back order due to error:", error.message);
    await db.OrderItem.destroy({ where: { orderId: order.id } });
    await db.Order.destroy({ where: { id: order.id } });
    throw new BadRequestError("Failed to place order. Please try again.");
  }
});

const getUserOrders = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;

  const orders = await db.Order.findAll({
    where: { userId },
    include: [
      {
        model: db.OrderItem,
        as: "orderItems",
        include: [{ model: db.Product, as: "product" }],
      },
    ],
  });

  if (!orders) {
    throw new NotFoundError("No orders found");
  }

  res.status(StatusCodes.OK).json({ orders });
});

const getUserOrdersByWarehouse = asyncWrapper(async (req, res) => {
  const { id: warehouseId } = req.user;

  const orders = await db.Order.findAll({
    where: { warehouseId },
    include: [
      {
        model: db.OrderItem,
        as: "orderItems",
        include: [{ model: db.Product, as: "product" }],
      },
      {
        model: db.Users,
        as: "user",
        attributes: [
          "id",
          "emergencyContact",
          "firstname",
          "lastname",
          "email",
          "phoneNumber",
          "address",
        ],
      }
    ],
  });

  if (!orders) {
    throw new NotFoundError("No orders found for this warehouse");
  }

  res.status(StatusCodes.OK).json({ orders });
});

const getOrdersDetails = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const order = await db.Order.findOne({
    where: { id },
    include: [
      {
        model: db.OrderItem,
        as: "orderItems",
        include: [
          {
            model: db.Product,
            as: "product",
          },
        ],
      },
      {
        model: db.Users,
        as: "warehouse",
        attributes: [
          "id",
          "firstname",
          "lastname",
          "email",
          "category",
          "address",
          "profileImage",
        ],
      },
    ],
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return res.status(StatusCodes.OK).json({ order });
});

const deleteOrder = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const order = await db.Order.findOne({ where: { id } });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  await db.Order.destroy({ where: { id } });
  return res
    .status(StatusCodes.OK)
    .json({ message: "Order deleted successfully" });
});
module.exports = {
  placeOrder,
  getUserOrders,
  getOrdersDetails,
  getUserOrdersByWarehouse,
  deleteOrder,
};
