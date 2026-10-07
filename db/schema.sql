DROP TABLE IF EXISTS orders_products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id serial PRIMARY KEY,
    username text UNIQUE NOT NULL,
    password text NOT NULL
);

CREATE TABLE products (
    id serial PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    price decimal NOT NULL
);

CREATE TABLE orders (
    id serial PRIMARY KEY,
    date date NOT NULL DEFAULT CURRENT_DATE,
    note text,
    user_id int REFERENCES users(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE orders_products (
    order_id int REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id int REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity int NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

