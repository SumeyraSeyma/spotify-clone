import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized - you must be logged in" });
  }

  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.session.userId);
    const isAdmin =
      process.env.ADMIN_EMAILS ===
      currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res
        .status(401)
        .json({ message: "Unauthorized - you must be an admin" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
