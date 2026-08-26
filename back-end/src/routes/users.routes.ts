import { Request, Response, NextFunction, Router } from "express";
import { authUser, createUser, authUserById } from "../db/database.js";
import bcrypt from "bcrypt";

const router = Router();

const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
    res.status(400).json({
        success: false,
        message: "email and password are required."
    });

    return;
    }

    const queryResult = await authUser(email);

    if (queryResult.length === 0) {
      res.status(401).json({
        success: false,
        message: "User is not registered.",
      });

      return;
    }

    const user = queryResult[0];

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      res.status(401).json({
        success: false,
        message: "Incorrect password."
      });

      return;
    }

    req.session.userId = user.id;

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        email: email
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session.userId) {
      res.status(401).json({
        success: false,
        message: "Not logged in."
      });

      return;
    }

    const queryResult = await authUserById(req.session.userId);

    if (queryResult.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found."
      });

      return;
    }

    const user = queryResult[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};


const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name, email, password } = req.body as {
      first_name?: string;
      last_name?: string;
      email?: string;
      password?: string;
    };

    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "First name, last name, email and password are required.",
      });

      return;
    }

    const queryResult = await createUser(first_name, last_name, email, password);

    if (queryResult.affectedRows === 1) {
      res.status(201).json({
        success: true,
        message: "User registered.",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "User was not registered.",
    });
  } catch (error) {
    next(error);
  }
};

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", getCurrentUser);

export default router;