import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { refreshTokensTable, usersTable } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import ApiResponse from "../utils/api-response.js";
import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessAndRefreshToken = async (
	userPayload: any,
	sessionId: string,
) => {
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
	const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

	if (!accessTokenSecret || !refreshTokenSecret) {
		throw new ApiError(
			500,
			"ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be configured",
		);
	}

	// Access token payload
	const accessToken = jwt.sign(userPayload, accessTokenSecret, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
	});

	// Refresh token payload includes sessionId
	const refreshToken = jwt.sign(
		{ ...userPayload, sessionId },
		refreshTokenSecret,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
		},
	);

	return { accessToken, refreshToken };
};

export const registerUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { name, role, email, age, password } = req.body;

		if (!name || !role || !email || !age || !password) {
			throw new ApiError(404, "All fields are required to create an User");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));

		if (existingUser.length > 0) {
			throw new ApiError(406, `User already exists with email ${email}`);
		}

		await db.insert(usersTable).values({
			...req.body,
			password: hashedPassword,
		});

		res.json(
			new ApiResponse(200, `User created successfully with mail ${email}`),
		);
	},
);

export const loginUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new ApiError(404, "Email and password are required to login");
		}

		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));

		if (existingUser.length === 0) {
			throw new ApiError(404, `User not found with email ${email}`);
		}

		const isMatch = await bcrypt.compare(password, existingUser[0].password);

		if (!isMatch) {
			throw new ApiError(401, "Invalid Password");
		}

		const userPayload = {
			id: existingUser[0].id,
			name: existingUser[0].name,
			email: existingUser[0].email,
			role: existingUser[0].role,
		};
		const refreshTokenExpiry = new Date();
		refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

		const [refreshTokenId] = await db
			.insert(refreshTokensTable)
			.values({
				token: "",
				userId: existingUser[0].id,
				expiresAt: refreshTokenExpiry,
			})
			.returning({ sessionId: refreshTokensTable.id });

		const sessionId = refreshTokenId.sessionId;

		const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
			userPayload,
			String(sessionId),
		);

		await db
			.update(refreshTokensTable)
			.set({ token: refreshToken })
			.where(eq(refreshTokensTable.id, sessionId));

		res.json(
			new ApiResponse(200, "User logged in successfully", {
				accessToken,
				refreshToken,
			}),
		);
	},
);

export const refreshToken = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { refreshToken: incomingToken } = req.body;

		if (!incomingToken) {
			throw new ApiError(400, "Refresh token is required");
		}

		const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
		if (!refreshTokenSecret) {
			throw new ApiError(500, "REFRESH_TOKEN_SECRET is not configured");
		}

		// verigy the incoming refresh token
		let verifiedToken;

		try {
			verifiedToken = jwt.verify(incomingToken, refreshTokenSecret);
		} catch (error) {
			throw new ApiError(401, "Invalid or expired refresh token");
		}

		const { sessionId, id, name, email, role } = verifiedToken as {
			sessionId: string;
			id: string;
			name: string;
			email: string;
			role: string;
		};

		// Check if the token exists in the database
		const storedToken = await db
			.select()
			.from(refreshTokensTable)
			.where(eq(refreshTokensTable.id, Number(sessionId)));

		// 3. Verify session exists
		if (storedToken.length === 0 || storedToken[0].token !== incomingToken) {
			throw new ApiError(401, "Refresh token not found or does not match");
		}

		// // 4. Verify token matches (detect token reuse/theft)
		if (storedToken[0].token !== incomingToken) {
			await db
				.delete(refreshTokensTable)
				.where(eq(refreshTokensTable.id, Number(sessionId)));

			throw new ApiError(401, "Refresh token mismatch. Session revoked.");
		}

		// 5. Check database expiration
		if (new Date(storedToken[0].expiresAt) < new Date()) {
			await db
				.delete(refreshTokensTable)
				.where(eq(refreshTokensTable.id, Number(sessionId)));

			throw new ApiError(401, "Session expired. Please log in again.");
		}

		// 6. Token Rotation: Issue new tokens using same sessionId
		const userPayload = { id, name, email, role };
		const { accessToken, refreshToken: newRefreshToken } =
			await generateAccessAndRefreshToken(userPayload, sessionId);

		const newExpiry = new Date();
		newExpiry.setDate(newExpiry.getDate() + 7);

		await db
			.update(refreshTokensTable)
			.set({
				token: newRefreshToken,
				expiresAt: newExpiry,
			})
			.where(eq(refreshTokensTable.id, Number(sessionId)));

		return res.json(
			new ApiResponse(200, "Token refreshed successfully", {
				accessToken,
				refreshToken: newRefreshToken,
				sessionId,
			}),
		);
	},
);
