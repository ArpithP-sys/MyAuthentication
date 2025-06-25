import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.id) {
            req.userId = decoded.id;  // ✅ Safe to use
        } else {
            return res.status(401).json({ message: "Invalid token. Not Authorized" });
        }

        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default userAuth;
