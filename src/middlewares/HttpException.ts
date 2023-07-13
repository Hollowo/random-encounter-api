import { HttpException } from "@nestjs/common";

class UserNotFoundException extends HttpException {
    constructor() {
        super('User not found', 404);
    }
} 

class InvalidCredentialsException extends HttpException {
    constructor() {
        super('Invalid credentials or user not found with provided password', 404)
    }
}

export { 
    UserNotFoundException,
    InvalidCredentialsException
};