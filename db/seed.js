import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createProduct } from "#db/queries/products";
import { createOrder } from "#db/queries/orders";
import { createOrdersProducts } from "#db/queries/orders_products";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user = await createUser("harrywizkid", "potter123");

  const products = [];
  for (let i = 1; i <= 10; i++) {
    const product = await createProduct(
      `Product ${i}`,
      `Description for product ${i}`,
      (i * 9.99).toFixed(2),
    );
    products.push(product);
  }

  const order = await createOrder("2026-10-07", "First test order", user.id);

  for (let i = 0; i < 5; i++) {
    await createOrdersProducts(order.id, products[i].id, i + 1);
  }
}
