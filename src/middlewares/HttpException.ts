import { HttpException } from "@nestjs/common";

class UserNotFoundException extends HttpException {
    constructor() {
        super('User not found', 404);
    }
}

class InvalidCredentialsException extends HttpException {
    constructor() {
        super('Invalid credentials', 401)
    }
}

class InvalidRefreshToken extends HttpException {
    constructor() {
        super('Invalid refresh token', 401)
    }
}

class UserAlreadyExist extends HttpException {
    constructor() {
        super('Email already in use', 409)
    }
}

class UserAlreadyInTheTable extends HttpException {
    constructor() {
        super('User already in the table', 409)
    }
}

export {
    UserNotFoundException,
    InvalidCredentialsException,
    InvalidRefreshToken,
    UserAlreadyExist,
    UserAlreadyInTheTable
};