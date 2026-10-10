export default class ApiError extends Error {
	constructor(
		statusCode,
		message = "some error occurred",
		error = [],
		stack = "",
	) {
		super(message);
		this.statusCode = statusCode;
		this.error = error;
		this.data = null;
		this.success = false;
		this.stack = stack;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
