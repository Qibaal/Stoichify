import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import path from "path";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

interface CustomSession extends session.SessionData {
    userId?: number;
}

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

dotenv.config();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session setup
app.use(
    session({
        secret: "test-secret",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
    })
);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/get-user", async (req, res) => {
    const session = req.session as CustomSession;

    if (!session.userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        // Find the user by ID
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                name: true,
                email: true,
                score: true,
                state: true,
                currentQuestion: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send back the user data
        res.json(user);
    } catch (error) {
        console.error("Error retrieving user data:", error);
        res.status(500).json({
            message: "An error occurred while retrieving user data",
        });
    }
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/login.html"));
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        // Compare the password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        // Create a session for the user
        (req.session as CustomSession).userId = user.id;

        // Store the session in the database
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day expiration
        await prisma.session.create({
            data: {
                userId: user.id,
                expiresAt,
                data: {},
            },
        });

        res.json({
            message: "Login successful",
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred during login" });
    }
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/register.html"));
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body; // Added `name`

    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database with the name field
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred during registration",
        });
    }
});

app.get("/virtual-lab", (req, res) => {
    const session = req.session as CustomSession;
    if (session.userId) {
        res.sendFile(path.join(__dirname, "/public/virtual-lab.html"));
    } else {
        res.redirect("/login");
    }
});

app.get("/virtual-lab-test", (req, res) => {
    const session = req.session as CustomSession;
    if (session.userId) {
        res.sendFile(path.join(__dirname, "/public/virtual-lab-test.html"));
    } else {
        res.redirect("/login");
    }
});

app.get("/check-session", (req, res) => {
    const session = req.session as CustomSession;
    if (session.userId) {
        // User is logged in
        res.json({ isLoggedIn: true });
    } else {
        // User is not logged in
        res.json({ isLoggedIn: false });
    }
});

app.post("/save-state", async (req, res) => {
    const {
        acidDropZone,
        baseDropZone,
        selectedAcid,
        selectedBase,
        counter1,
        counter2,
    } = req.body;
    const session = req.session as CustomSession;

    if (!session.userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const stateData = {
            acidDropZone,
            baseDropZone,
            selectedAcid,
            selectedBase,
            counter1,
            counter2,
        };

        // Update the user's state in the database
        await prisma.user.update({
            where: { id: session.userId },
            data: {
                state: stateData,
            },
        });

        res.json({ message: "State saved successfully" });
    } catch (error) {
        console.error("Error saving state:", error);
        res.status(500).json({
            message: "An error occurred while saving the state",
        });
    }
});

app.post("/update-score", async (req, res) => {
    const { score } = req.body;
    const session = req.session as CustomSession;

    if (!session.userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        // Update the user's score in the database
        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: { score: score },
        });

        res.json({ message: "Score updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating score:", error);
        res.status(500).json({
            message: "An error occurred while updating the score",
        });
    }
});


app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Failed to destroy session:", err);
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid"); // Clears the session cookie
        res.json({ message: "Logged out successfully" });
    });
});

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

export default app;