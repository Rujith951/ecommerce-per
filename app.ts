import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./src/routes/auth.route.ts";

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5000")
	.split(",")
	.map(origin => origin.trim().replace(/^['"]|['"]$/g, ""));

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
				return;
			}

			callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use("/api/v1/auth", authRouter);

export default app;
