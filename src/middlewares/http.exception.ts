import { HttpException } from "@nestjs/common";

class UserNotFoundException extends HttpException {
    constructor() {
        super('User not found', 404);
    }
}

class UserOrTableNotFoundException extends HttpException {
    constructor() {
        super('User or/and Table not found', 404);
    }
}

class InvalidCredentialsException extends HttpException {
    constructor() {
        super('Invalid credentials', 401)
    }
}

class InvalidRefreshTokenException extends HttpException {
    constructor() {
        super('Invalid refresh token', 401)
    }
}

class UserAlreadyExistException extends HttpException {
    constructor() {
        super('Email already in use', 409)
    }
}

class UserAlreadyInTheTableException extends HttpException {
    constructor() {
        super('User already in the table', 409)
    }
}

export {
    UserNotFoundException,
    InvalidCredentialsException,
    InvalidRefreshTokenException,
    UserAlreadyExistException,
    UserAlreadyInTheTableException,
    UserOrTableNotFoundException
};