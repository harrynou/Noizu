class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized access") {
        super(message, 401);
    }
}

class ConflictError extends AppError {
    constructor(message = "Conflict: Resource already exists") {
        super(message, 409);
    }
}

class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export { AppError, UnauthorizedError, ConflictError, NotFoundError };
