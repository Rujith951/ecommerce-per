import { relations } from "drizzle-orm/_relations";
import {
	pgTable,
	integer,
	varchar,
	timestamp,
	text,
	numeric,
	unique,
	pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["admin", "user", "seller"]);
export const orderStatusEnum = pgEnum("status", [
	"pending",
	"shipped",
	"delivered",
	"cancelled",
]);

// // A foreign key connects two tables at the database level. For example,
// // products.categoryId must point to an existing categories.id.
// export const usersTable = pgTable("users", {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar({ length: 255 }).notNull(),
// 	age: integer().notNull(),
// 	email: varchar({ length: 255 }).notNull().unique(),
// 	role: varchar({ length: 10 }).notNull(),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// export const categoriesTable = pgTable("categories", {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar({ length: 100 }).notNull().unique(),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// export const productsTable = pgTable("products", {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	categoryId: integer("category_id")
// 		.notNull()
// 		.references(() => categoriesTable.id),
// 	name: varchar({ length: 255 }).notNull(),
// 	description: text(),
// 	price: numeric({ precision: 10, scale: 2 }).notNull(),
// 	stock: integer().notNull().default(0),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// 	updatedAt: timestamp("updated_at").defaultNow().notNull(),
// });

// export const cartsTable = pgTable("carts", {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	userId: integer("user_id")
// 		.notNull()
// 		.unique()
// 		.references(() => usersTable.id),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// 	updatedAt: timestamp("updated_at").defaultNow().notNull(),
// });

// export const cartItemsTable = pgTable(
// 	"cart_items",
// 	{
// 		id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 		cartId: integer("cart_id")
// 			.notNull()
// 			.references(() => cartsTable.id),
// 		productId: integer("product_id")
// 			.notNull()
// 			.references(() => productsTable.id),
// 		quantity: integer().notNull().default(1),
// 		createdAt: timestamp("created_at").defaultNow().notNull(),
// 	},
// 	table => [unique("cart_product_unique").on(table.cartId, table.productId)],
// );

// export const ordersTable = pgTable("orders", {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	userId: integer("user_id")
// 		.notNull()
// 		.references(() => usersTable.id),
// 	status: varchar({ length: 30 }).notNull().default("PLACED"),
// 	totalAmount: numeric("total_amount", {
// 		precision: 10,
// 		scale: 2,
// 	}).notNull(),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// 	updatedAt: timestamp("updated_at").defaultNow().notNull(),
// });

// export const orderItemsTable = pgTable("order_items", {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	orderId: integer("order_id")
// 		.notNull()
// 		.references(() => ordersTable.id),
// 	productId: integer("product_id")
// 		.notNull()
// 		.references(() => productsTable.id),
// 	quantity: integer().notNull(),
// 	price: numeric({ precision: 10, scale: 2 }).notNull(),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// // Drizzle relations describe how tables are connected for application queries.
// // They do not create extra database columns or replace the foreign keys above.
// // `one` returns one related row; `many` returns an array of related rows.
// export const usersRelations = relations(usersTable, ({ one, many }) => ({
// 	cart: one(cartsTable),
// 	orders: many(ordersTable),
// }));

// export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
// 	products: many(productsTable),
// }));

// export const productsRelations = relations(productsTable, ({ one, many }) => ({
// 	category: one(categoriesTable, {
// 		fields: [productsTable.categoryId],
// 		references: [categoriesTable.id],
// 	}),
// 	cartItems: many(cartItemsTable),
// 	orderItems: many(orderItemsTable),
// }));

// export const cartsRelations = relations(cartsTable, ({ one, many }) => ({
// 	user: one(usersTable, {
// 		fields: [cartsTable.userId],
// 		references: [usersTable.id],
// 	}),
// 	items: many(cartItemsTable),
// }));

// export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
// 	cart: one(cartsTable, {
// 		fields: [cartItemsTable.cartId],
// 		references: [cartsTable.id],
// 	}),
// 	product: one(productsTable, {
// 		fields: [cartItemsTable.productId],
// 		references: [productsTable.id],
// 	}),
// }));

// export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
// 	user: one(usersTable, {
// 		fields: [ordersTable.userId],
// 		references: [usersTable.id],
// 	}),
// 	items: many(orderItemsTable),
// }));

// export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
// 	order: one(ordersTable, {
// 		fields: [orderItemsTable.orderId],
// 		references: [ordersTable.id],
// 	}),
// 	product: one(productsTable, {
// 		fields: [orderItemsTable.productId],
// 		references: [productsTable.id],
// 	}),
// }));

/*
===========================================================
IMPORTANT CONCEPT
===========================================================

There are TWO different things happening here:

1. PostgreSQL FOREIGN KEY
   --------------------------------
   This is the actual database relationship.

   Example:

   product.category_id → categories.id

   PostgreSQL enforces that category_id must point to
   an existing categories.id.

2. Drizzle relations()
   --------------------------------
   This describes the relationship to Drizzle so that
   JavaScript queries can easily load related records.

   relations() DOES NOT create the foreign key.

Think:

    PostgreSQL FK
        ↓
    Database-level protection

    Drizzle relations()
        ↓
    Application-level query convenience


===========================================================
1. USERS
===========================================================
*/

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),

	name: varchar({ length: 255 }).notNull(),

	age: integer().notNull(),

	email: varchar({ length: 255 }).notNull().unique(),

	password: varchar({ length: 255 }).notNull(),

	role: varchar({ length: 10 }).notNull().default("user"),

	createdAt: timestamp("created_at").defaultNow().notNull(),
});

/*
NORMAL PostgreSQL:

CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
*/

export const refreshTokensTable = pgTable("refresh_tokens", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: integer("user_id")
		.notNull()
		.references(() => usersTable.id),
	token: text().notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	expiresAt: timestamp("expired_at").notNull(),
	revokedAt: timestamp("revoked_at"),
});

/*
===========================================================
2. CATEGORIES
===========================================================
*/

export const categoriesTable = pgTable("categories", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),

	name: varchar({ length: 100 }).notNull().unique(),

	createdAt: timestamp("created_at").defaultNow().notNull(),
});

/*
NORMAL PostgreSQL:

CREATE TABLE categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
*/

/*
===========================================================
3. PRODUCTS
===========================================================
*/

export const productsTable = pgTable("products", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),

	categoryId: integer("category_id")
		.notNull()

		/*
		Drizzle:
		This creates the FOREIGN KEY relationship.

		Equivalent PostgreSQL:

		FOREIGN KEY (category_id)
		REFERENCES categories(id)
		*/
		.references(() => categoriesTable.id),

	name: varchar({ length: 255 }).notNull(),

	description: text(),

	price: numeric({
		precision: 10,
		scale: 2,
	}).notNull(),

	stock: integer().notNull().default(0),

	createdAt: timestamp("created_at").defaultNow().notNull(),

	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/*
NORMAL PostgreSQL:

CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    category_id INTEGER NOT NULL,

    name VARCHAR(255) NOT NULL,

    description TEXT,

    price NUMERIC(10,2) NOT NULL,

    stock INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW() NOT NULL,

    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
);


RELATIONSHIP:

categories 1 ───────── N products


Example:

categories
--------------------------------
id    name
1     Electronics
2     Clothing


products
--------------------------------
id    category_id    name
1     1              iPhone
2     1              Laptop
3     2              T-Shirt


Here:

Electronics
    │
    ├── iPhone
    └── Laptop

Clothing
    │
    └── T-Shirt
*/

/*
===========================================================
4. CARTS
===========================================================
*/

export const cartsTable = pgTable("carts", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),

	userId: integer("user_id")
		.notNull()

		/*
		PostgreSQL:

		FOREIGN KEY (user_id)
		REFERENCES users(id)
		*/
		.references(() => usersTable.id)

		/*
		Because user_id is UNIQUE:

		One user can have only ONE cart.

		PostgreSQL:

		UNIQUE (user_id)
		*/
		.unique(),

	createdAt: timestamp("created_at").defaultNow().notNull(),

	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/*
NORMAL PostgreSQL:

CREATE TABLE carts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INTEGER NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT NOW() NOT NULL,

    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);


RELATIONSHIP:

users 1 ───────── 1 carts


Example:

users
-----------
id
1   Rujith
2   Rahul

carts
-----------
id    user_id
1     1
2     2


User 1 → Cart 1
User 2 → Cart 2


Because user_id is UNIQUE:

user_id = 1
user_id = 1    ❌ duplicate
*/

/*
===========================================================
5. CART ITEMS
===========================================================
*/

export const cartItemsTable = pgTable(
	"cart_items",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),

		cartId: integer("cart_id")
			.notNull()

			/*
			PostgreSQL:

			FOREIGN KEY (cart_id)
			REFERENCES carts(id)
			*/
			.references(() => cartsTable.id),

		productId: integer("product_id")
			.notNull()

			/*
			PostgreSQL:

			FOREIGN KEY (product_id)
			REFERENCES products(id)
			*/
			.references(() => productsTable.id),

		quantity: integer().notNull().default(1),

		createdAt: timestamp("created_at").defaultNow().notNull(),
	},

	/*
	IMPORTANT:

	Same product should appear only ONCE
	inside the same cart.

	Example:

	cart_id | product_id
	--------+-----------
	1       | 10
	1       | 10    ❌

	Instead:

	cart_id | product_id | quantity
	--------+------------+---------
	1       | 10         | 2

	PostgreSQL equivalent:

	UNIQUE (cart_id, product_id)
	*/
	table => [unique("cart_product_unique").on(table.cartId, table.productId)],
);

/*
NORMAL PostgreSQL:

CREATE TABLE cart_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    cart_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    quantity INTEGER NOT NULL DEFAULT 1,

    created_at TIMESTAMP DEFAULT NOW() NOT NULL,

    FOREIGN KEY (cart_id)
        REFERENCES carts(id),

    FOREIGN KEY (product_id)
        REFERENCES products(id),

    UNIQUE (cart_id, product_id)
);


RELATIONSHIPS:

carts    1 ───────── N cart_items

products 1 ───────── N cart_items


IMPORTANT:

Product → Cart Items = 1:N

Why?

The same product can be inside MANY different carts.

Example:

Product: iPhone

Cart 1 → iPhone → quantity 2
Cart 2 → iPhone → quantity 1
Cart 3 → iPhone → quantity 5


But:

Cart 1 → iPhone → quantity 2
Cart 1 → iPhone → quantity 1    ❌

because:

UNIQUE(cart_id, product_id)
*/

/*
===========================================================
6. ORDERS
===========================================================
*/

export const ordersTable = pgTable("orders", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),

	userId: integer("user_id")
		.notNull()

		/*
		PostgreSQL:

		FOREIGN KEY (user_id)
		REFERENCES users(id)
		*/
		.references(() => usersTable.id),

	status: varchar({ length: 30 }).notNull().default("pending"),

	totalAmount: numeric("total_amount", {
		precision: 10,
		scale: 2,
	}).notNull(),

	createdAt: timestamp("created_at").defaultNow().notNull(),

	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/*
NORMAL PostgreSQL:

CREATE TABLE orders (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INTEGER NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'PLACED',

    total_amount NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT NOW() NOT NULL,

    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);


RELATIONSHIP:

users 1 ───────── N orders


Example:

User 1
   │
   ├── Order 101
   ├── Order 102
   └── Order 103
*/

/*
===========================================================
7. ORDER ITEMS
===========================================================
*/

export const orderItemsTable = pgTable("order_items", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),

	orderId: integer("order_id")
		.notNull()

		/*
		PostgreSQL:

		FOREIGN KEY (order_id)
		REFERENCES orders(id)
		*/
		.references(() => ordersTable.id),

	productId: integer("product_id")
		.notNull()

		/*
		PostgreSQL:

		FOREIGN KEY (product_id)
		REFERENCES products(id)
		*/
		.references(() => productsTable.id),

	quantity: integer().notNull(),

	/*
	IMPORTANT:

	We store the price at the time of purchase.

	Product price can change later.

	Example:

	Product price today = ₹50,000

	Order created:
	price = ₹50,000

	Later product price = ₹55,000

	Old order should still show ₹50,000.
	*/
	price: numeric({
		precision: 10,
		scale: 2,
	}).notNull(),

	createdAt: timestamp("created_at").defaultNow().notNull(),
});

/*
NORMAL PostgreSQL:

CREATE TABLE order_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    order_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    quantity INTEGER NOT NULL,

    price NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT NOW() NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES orders(id),

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);


RELATIONSHIPS:

orders   1 ───────── N order_items

products 1 ───────── N order_items


Example:

Order #101
    │
    ├── iPhone × 1
    ├── Mouse × 2
    └── Keyboard × 1
*/

/*
===========================================================
DRIZZLE RELATIONS
===========================================================

Everything above `.references()` is DATABASE LEVEL.

Everything below `relations()` is DRIZZLE APPLICATION LEVEL.

relations() DOES NOT create:

- columns
- foreign keys
- unique constraints
- database tables

It tells Drizzle:

"These tables are related, so allow me to
query them conveniently."
*/

/*
===========================================================
USERS RELATIONS
===========================================================
*/

export const usersRelations = relations(usersTable, ({ one, many }) => ({
	cart: one(cartsTable),

	orders: many(ordersTable),
}));

/*
MEANING:

One user
    │
    ├── one cart
    │
    └── many orders


Drizzle usage:

db.query.usersTable.findFirst({
    with: {
        cart: true,
        orders: true,
    },
});


WITHOUT relations():

You would manually JOIN:

SELECT *
FROM users
LEFT JOIN carts
    ON carts.user_id = users.id
LEFT JOIN orders
    ON orders.user_id = users.id;
*/

/*
===========================================================
CATEGORIES RELATIONS
===========================================================
*/

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
	products: many(productsTable),
}));

/*
MEANING:

One category
      │
      ├── Product
      ├── Product
      └── Product


Drizzle:

db.query.categoriesTable.findFirst({
    with: {
        products: true,
    },
});


NORMAL PostgreSQL:

SELECT *
FROM products
WHERE category_id = 1;
*/

/*
===========================================================
PRODUCTS RELATIONS
===========================================================
*/

export const productsRelations = relations(productsTable, ({ one, many }) => ({
	category: one(categoriesTable, {
		fields: [productsTable.categoryId],

		references: [categoriesTable.id],
	}),

	cartItems: many(cartItemsTable),

	orderItems: many(orderItemsTable),
}));

/*
MEANING:

One product belongs to:

    ONE category

and can appear in:

    MANY cart_items

and:

    MANY order_items


NORMAL PostgreSQL:

SELECT
    products.*,
    categories.name
FROM products
JOIN categories
    ON products.category_id = categories.id;


For cart items:

SELECT *
FROM cart_items
WHERE product_id = 10;


For order items:

SELECT *
FROM order_items
WHERE product_id = 10;
*/

/*
===========================================================
CARTS RELATIONS
===========================================================
*/

export const cartsRelations = relations(cartsTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [cartsTable.userId],

		references: [usersTable.id],
	}),

	items: many(cartItemsTable),
}));

/*
MEANING:

One cart belongs to:

    ONE user

and contains:

    MANY cart_items


Drizzle:

db.query.cartsTable.findFirst({
    with: {
        user: true,
        items: true,
    },
});


NORMAL PostgreSQL:

SELECT *
FROM carts
JOIN users
    ON carts.user_id = users.id
WHERE carts.id = 1;


SELECT *
FROM cart_items
WHERE cart_id = 1;
*/

/*
===========================================================
CART ITEMS RELATIONS
===========================================================
*/

export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
	cart: one(cartsTable, {
		fields: [cartItemsTable.cartId],

		references: [cartsTable.id],
	}),

	product: one(productsTable, {
		fields: [cartItemsTable.productId],

		references: [productsTable.id],
	}),
}));

/*
MEANING:

One cart_item belongs to:

    ONE cart

and:

    ONE product


Example:

cart_item
    │
    ├── cart → Cart #1
    │
    └── product → iPhone


Drizzle:

db.query.cartItemsTable.findFirst({
    with: {
        cart: true,
        product: true,
    },
});


NORMAL PostgreSQL:

SELECT
    cart_items.*,
    products.*
FROM cart_items
JOIN products
    ON cart_items.product_id = products.id
WHERE cart_items.cart_id = 1;
*/

/*
===========================================================
ORDERS RELATIONS
===========================================================
*/

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [ordersTable.userId],

		references: [usersTable.id],
	}),

	items: many(orderItemsTable),
}));

/*
MEANING:

One order belongs to:

    ONE user

and contains:

    MANY order_items


Drizzle:

db.query.ordersTable.findFirst({
    with: {
        user: true,
        items: true,
    },
});


NORMAL PostgreSQL:

SELECT *
FROM orders
JOIN users
    ON orders.user_id = users.id
WHERE orders.id = 101;


SELECT *
FROM order_items
WHERE order_id = 101;
*/

/*
===========================================================
ORDER ITEMS RELATIONS
===========================================================
*/

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
	order: one(ordersTable, {
		fields: [orderItemsTable.orderId],

		references: [ordersTable.id],
	}),

	product: one(productsTable, {
		fields: [orderItemsTable.productId],

		references: [productsTable.id],
	}),
}));

/*
MEANING:

One order_item belongs to:

    ONE order

and:

    ONE product


Example:

Order Item
    │
    ├── order → Order #101
    │
    └── product → iPhone


NORMAL PostgreSQL:

SELECT
    order_items.*,
    products.*
FROM order_items
JOIN products
    ON order_items.product_id = products.id
WHERE order_items.order_id = 101;
*/
