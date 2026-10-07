import express from "express";
const router = express.Router();
import requireUser from "#middleware/requireUser";
export default router;

import { getProducts, getProductById } from "#db/queries/products";
import { getOrdersByProductIdAndUserID } from "#db/queries/orders";

router.get("/", async (req, res) => {
  const products = await getProducts();
  res.send(products);
});

router.param("id", async (req, res, next, id) => {
  const product = await getProductById(id);
  if (!product) return res.status(404).send("Product not found.");
  req.product = product;
  next();
});

router.get("/:id", (req, res) => {
  res.send(req.product);
});

router.get("/:id/orders", requireUser, async (req, res) => {
  const orders = await getOrdersByProductIdAndUserID(
    req.params.id,
    req.user.id,
  );
  res.send(orders);
});
