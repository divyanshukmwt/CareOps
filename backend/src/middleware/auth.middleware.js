  import jwt from "jsonwebtoken";

  export const requireAuth = (req, res, next) => {
    const token = req.cookies.careops_token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
