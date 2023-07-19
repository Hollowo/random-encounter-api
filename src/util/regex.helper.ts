const password: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$ %^&*-]).{8,}$/

export const RegExHelper = {
    password,
}