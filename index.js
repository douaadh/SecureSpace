
import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import connectDB from "./db.js";
import users from "./users.schema.js";
import transporter from "./mailer.js";

const app = express();

// Fixed backend port
const PORT = 3000;

// ==================== MIDDLEWARE ====================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// ==================== COOKIE CONFIGURATION ====================

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

// ==================== AUTH HELPERS ====================

function createToken(userId) {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function sendAuthCookie(res, token) {
  res.cookie("jwt_token", token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000,
  });
}

function clearAuthCookie(res) {
  res.clearCookie("jwt_token", cookieOptions);
}

// ==================== AUTH MIDDLEWARE ====================

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.jwt_token;

    if (!token) {
      return res.status(401).json({
        message: "Please sign in.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await users
      .findById(decoded.userId)
      .select("-password");

    if (!user) {
      clearAuthCookie(res);

      return res.status(401).json({
        message: "Account not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    clearAuthCookie(res);

    return res.status(401).json({
      message: "Your session has expired. Please sign in again.",
    });
  }
}

// ==================== HEALTH CHECK ====================

app.get("/api/health", (req, res) => {
  res.json({
    message: "SecureSpace API is running.",
  });
});

// ==================== SIGNUP ====================

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({
        message:
          "Enter a name, valid email, and password of 8-128 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await users.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await users.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully. Please sign in.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Signup error:", error.message);

    return res.status(500).json({
      message: "Unable to create your account.",
    });
  }
});

// ==================== LOGIN ====================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await users
      .findOne({
        email: email.trim().toLowerCase(),
      })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    sendAuthCookie(res, createToken(user._id));

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Unable to sign in right now.",
    });
  }
});

// ==================== LOGOUT ====================

app.post("/logout", (req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    message: "Logged out successfully.",
  });
});

// ==================== CURRENT USER ====================

app.get("/api/auth/me", requireAuth, (req, res) => {
  return res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

// ==================== FORGOT PASSWORD ====================

app.post("/api/auth/forgot-password", async (req, res) => {
  const genericMessage =
    "If an account exists with this email, you will receive a reset link.";

  try {
    const { email } = req.body || {};

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await users.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json({
        message: genericMessage,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedResetToken;

    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    const frontendUrl = (
      process.env.FRONTEND_URL || "http://localhost:5173"
    ).replace(/\/$/, "");

    const resetUrl =
      `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      const info = await transporter.sendMail({
        from: '"SecureSpace" <no-reply@securespace.test>',
        to: user.email,
        subject: "Reset your SecureSpace password",

        text: `We received a request to reset your password.

Use this link to reset your password:
${resetUrl}

This link expires in 15 minutes and can only be used once.

If you did not request this, ignore this email.`,

        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
            <h2>Reset your SecureSpace password</h2>

            <p>We received a request to reset your password.</p>

            <p>
              <a
                href="${resetUrl}"
                style="
                  background:#6D28D9;
                  color:white;
                  padding:12px 20px;
                  border-radius:8px;
                  text-decoration:none;
                  display:inline-block;
                "
              >
                Reset password
              </a>
            </p>

            <p>
              This link expires in 15 minutes and can only be used once.
            </p>

            <p>
              If you did not request a reset, ignore this email.
            </p>
          </div>
        `,
      });

      console.log("Reset email sent successfully!");

      if (transporter.options.host === "smtp.ethereal.email") {
        const previewUrl = (
          await import("nodemailer")
        ).default.getTestMessageUrl(info);

        console.log("Email preview:", previewUrl);
      }
    } catch (mailError) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      console.error(
        "Reset email delivery failed:",
        mailError.message
      );

      return res.status(500).json({
        message: "Unable to send the reset email right now.",
      });
    }

    return res.status(200).json({
      message: genericMessage,
    });
  } catch (error) {
    console.error("Forgot-password error:", error.message);

    return res.status(500).json({
      message: "Unable to process your request right now.",
    });
  }
});

// ==================== RESET PASSWORD ====================

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body || {};

    if (
      typeof token !== "string" ||
      !/^[a-f0-9]{64}$/i.test(token) ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({
        message:
          "Provide a valid reset token and a password of 8-128 characters.",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await users.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired.",
      });
    }

    user.password = await bcrypt.hash(password, 12);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful. Please sign in.",
    });
  } catch (error) {
    console.error("Reset-password error:", error.message);

    return res.status(500).json({
      message: "Unable to reset your password right now.",
    });
  }
});

// ==================== START SERVER ====================

async function startServer() {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error(
      "MONGODB_URI and JWT_SECRET must be configured."
    );
  }

  await connectDB();

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`SecureSpace API running at http://127.0.0.1:${PORT}`);
    console.log(`Health check: http://127.0.0.1:${PORT}/api/health`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
