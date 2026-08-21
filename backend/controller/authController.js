const bcrypt = require("bcryptjs");
const {
    findUserByEmail,
    createUser
} = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerUser = (req, res) => {
    const { name, email, phone, password } = req.body;

    // 1. Check required fields
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    findUserByEmail(email, async (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create user
        createUser(
            name,
            email,
            phone,
            hashedPassword,
            (err, result) => {
                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: "Failed to create user"
                    });
                }

                // 5. Success response
                return res.status(201).json({
                    message: "User registered successfully",
                    userId: result.insertId
                });
            }
        );
    });
};


const loginUser = (req, res) => {
    const { email, password } = req.body;

    // 1. Check required fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // 2. Find user by email
    findUserByEmail(email, async (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        // 3. User not found
        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        // 4. Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 5. Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SCERET,
            {
                expiresIn: "7d"
            }
        );

        // 6. Send response
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    });
};
module.exports = {
    registerUser,
    loginUser
};