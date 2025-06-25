import userModel from "../models/usermodels.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userModel.findById(userId).select("name email isverified");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isverified: user.isverified,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
