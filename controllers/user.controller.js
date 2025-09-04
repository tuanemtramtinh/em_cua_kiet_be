// controllers/auth.controller.js (ESM)
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import User from "../models/user.model.js";
import mime from "mime-types";
import fsp from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AVATAR_ROOT = path.resolve(process.cwd(), "avatars");

function normalizeDbPath(dbPath) {
  // bỏ tiền tố "avatars\" hoặc "avatars/" nếu có
  let rel = dbPath.replace(/^avatars[\/\\]/i, "");
  // ép mọi dấu / hoặc \ về dấu phân cách của OS
  rel = rel.replace(/[/\\]+/g, path.sep);
  return rel;
}

export const register = async (req, res) => {
  try {
    // Cấu hình storage động ngay trong controller
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const username = req.body?.username;
        const uploadPath = path.resolve(process.cwd(), "avatars", username);
        // tạo thư mục nếu chưa có
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeBase = path.basename(file.originalname, ext).replace(/\s+/g, "_");
        const uniqueName = `${Date.now()}-${safeBase}${ext}`;
        cb(null, uniqueName);
      },
    });

    const fileFilter = (req, file, cb) => {
      const allowed = [".png", ".jpg", ".jpeg", ".webp"];
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.includes(ext)) {
        return cb(new Error("Chỉ cho phép ảnh: png, jpg, jpeg, webp"));
      }
      cb(null, true);
    };

    const upload = multer({
      storage,
      fileFilter,
    }).single("avatar");
    upload(req, res, async (err) => {
      if (err) {
        return res.badRequest(err.message);
      }

      try {
        const { name, username, password, email, hobby, dob, sex } = req.body;

        // Validate tối thiểu
        if (!username || !password || !email) {
          return res.badRequest("Thiếu username/password/email");
        }

        // Check trùng username
        const existed = await User.findOne({ username });
        if (existed) {
          return res.badRequest("Username already exists");
        }

        const cryptedPassword = await bcrypt.hash(password, 10);

        // Lưu đường dẫn avatar nếu có
        const avatarPath = req.file ? path.relative(process.cwd(), req.file.path) : null;

        // Tạo user (Mongoose)
        const newUser = await User.create({
          name,
          username,
          password: cryptedPassword,
          email,
          hobby,
          dob,
          sex,
          avatar: avatarPath,
          tick: false,
          avatar: avatarPath,
        });

        return res.success(newUser, "User registered successfully");
      } catch (innerErr) {
        return res.badRequest(innerErr.message || "Registration failed");
      }
    });
  } catch (error) {
    return res.badRequest(error.message || "Registration failed");
  }
};

export const getAvatarBinary = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).lean();
    if (!user?.avatar) return res.status(404).json({ error: "Not found" });

    const relSafe = normalizeDbPath(user.avatar);
    const absPath = path.resolve(AVATAR_ROOT, relSafe);

    // Chống path traversal: absPath phải nằm trong AVATAR_ROOT
    if (path.relative(AVATAR_ROOT, absPath).startsWith("..")) {
      return res.badRequest("Invalid avatar path");
    }

    await fsp.access(absPath, fs.constants.R_OK); // có tồn tại & đọc được?

    const stat = await fsp.stat(absPath);
    res.setHeader("Content-Type", mime.lookup(absPath) || "application/octet-stream");
    res.setHeader("Content-Length", stat.size.toString());
    res.setHeader("Last-Modified", stat.mtime.toUTCString());
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Content-Disposition", `inline; filename="${path.basename(absPath).replace(/"/g, "")}"`);

    fs.createReadStream(absPath)
      .on("error", () => res.status(500).end())
      .pipe(res);
  } catch (e) {
    return res.badRequest(e.message || "Get avatar failed");
  }
};

export const login = async (req, res) => {
  try{
    const {username, password} = req.body;
    const checkUser = await User.findOne({ username });
    if (!checkUser) {
      return res.badRequest("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, checkUser.password);
    if (!isPasswordValid) {
      return res.badRequest("Invalid password");
    }
    const userData = {
      id: checkUser._id,
      username: checkUser.username,
      email: checkUser.email,
      phone: checkUser.phone,
      dob: checkUser.dob,
    };
    return res.success(userData, "Login successful");
  }catch (error) {
    return res.badRequest(error.message || "Login failed");
  }
}

export const updateTick = async (req, res) => {
  const {userID} = req.body;
  try{
    const userUpdate = await User.findByIdAndUpdate(
      userID,
      { $set: { tick: true } },
      { new: true });
    if (!userUpdate) 
    {
      return res.badRequest("User not found");
    }
    return res.success(userUpdate, "Tick updated successfully");
  }
  catch (error) {
    return res.badRequest(error.message || "Update tick failed");
  }
}