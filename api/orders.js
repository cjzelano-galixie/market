import express from "express";
const router = express.Router();
export default router;

import {
  createOrder,
  getOrders,
  getOrderById,
  getOrdersByUserId,
} from "#db/queries/orders";
import { createOrdersProducts } from "#db/queries/orders_products";
import { getProductById, getProductsByOrderId } from "#db/queries/products";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

router.use(requireUser);

router.get("/", async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.send(orders || []);
});

router.post("/", requireBody(["date"]), async (req, res) => {
  const { date, note } = req.body;
  const order = await createOrder(date, note || null, req.user.id);
  res.status(201).json(order);
});

router.param("id", async (req, res, next, id) => {
  const order = await getOrderById(id);
  if (!order) return res.status(404).send("Order not found.");

  req.order = order;
  next();
});

router.get("/:id", (req, res) => {
  if (req.order.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }
  res.send(req.order);
});

router.get("/:id/products", async (req, res) => {
  if (req.order.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }
  const products = await getProductsByOrderId(req.order.id);
  res.send(products);
});

router.post(
  "/:id/products",
  requireBody(["productId", "quantity"]),
  async (req, res) => {
    if (req.order.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }

    const { productId, quantity } = req.body;

    const product = await getProductById(productId);
    if (!product) return res.status(400).send("Product does not exist.");

    const orderProduct = await createOrdersProducts(
      req.order.id,
      productId,
      quantity,
    );
    res.status(201).send(orderProduct);
  },
);
