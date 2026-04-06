import e from "express";
import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) {
      return res.status(400).json({ message: "User does not have token" });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res
        .status(400)
        .json({ message: "user does not have valid token" });
    }
    req.user = verifyToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({ message: `isAuth Error ${error}` });
  }
};

export default isAuth;
