const { Router } = require("express")
const authController = require("../controllers/user.controller")
const authRouter = Router()

//JsDoc Comments
/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register",authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
 */
authRouter.post("/login",authController.loginUserController)

module.exports = authRouter