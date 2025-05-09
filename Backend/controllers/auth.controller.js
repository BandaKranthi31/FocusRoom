import { createUser, getUserByEmail, getUserByUsername } from "../services/user.service.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined")
}

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        const existingUsername = await getUserByUsername(username)
        const existingEmail = await getUserByEmail(email)
        if (existingUsername || existingEmail) {
            return res.status(400).json({ success: false, message: "Username or email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await createUser({
            username,
            email,
            password: hashedPassword
        })

        if (!newUser) {
            return res.status(400).json({ success: false, message: "Failed to create user" })
        }
        // NOT generating token on sign up
        res.status(201).json({ success: true, message: "Sign up successfully." })
    } catch (error) {
        console.error("Error in signup controller", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        const user = await getUserByUsername(username)
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' })
        res.cookie('token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
        res.status(200).json({ success: true, message: "Login successful" })
    } catch (error) {
        console.error("Error in signin controller", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}
export const logout = async (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        res.clearCookie('token', {
            httpOnly: true,
            path: '/',
        })
        res.status(200).json({ success: true, message: "Logout successful" })
    } catch (error) {
        console.error("Error in logout controller", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}