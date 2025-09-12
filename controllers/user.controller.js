// controllers/auth.controller.js (ESM)
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { fileURLToPath } = require("url");
const User = require("../models/user.model.js");
const mime = require("mime-types");
const fsp = require("fs/promises");

const AVATAR_ROOT = path.resolve(process.cwd(), "avatars");

function normalizeDbPath(dbPath) {
  // bỏ tiền tố "avatars\" hoặc "avatars/" nếu có
  let rel = dbPath.replace(/^avatars[\/\\]/i, "");
  // ép mọi dấu / hoặc \ về dấu phân cách của OS
  rel = rel.replace(/[/\\]+/g, path.sep);
  return rel;
}

const assignType = async (req, res) => {
  try {
    const { userID } = req.params;
    const point = parseInt(req.body.point, 10); // ép sang số nguyên

    if (isNaN(point)) {
      return res.badRequest("Point phải là số");
    }

    let type = "";
    if (point >= 0 && point <= 7) {
      type = "Người quan sát";
    } else if (point > 7 && point <= 17) {
      type = "Người kết nối";
    } else if (point >= 18 && point < 24) {
      type = "Người sáng tạo";
    } else {
      type = "Không hợp lệ";
    }
    const result = await User.findByIdAndUpdate(
      userID,
      { $set: { type } },
      { new: true }
    );
    if (!result) {
      return res.badRequest("User not found");
    } else return res.success(result, "Assign type successfully");
  } catch (error) {
    return res.badRequest(error.message || "Assign type failed");
  }
};

const updateProfile = async (req, res) => {
  try {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const username = req.params.username;
        const uploadPath = path.resolve(process.cwd(), "avatars", username);
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeBase = path
          .basename(file.originalname, ext)
          .replace(/\s+/g, "_");
        cb(null, `${Date.now()}-${safeBase}${ext}`);
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

    const upload = multer({ storage, fileFilter }).single("avatar");

    upload(req, res, async (err) => {
      if (err) return res.badRequest({err});

      try {
        const username = req.params.username;
        const { hobby, name, dob, email, sex, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.badRequest("User not found");

        // Nếu có file mới
        if (req.file) {
          // (tuỳ chọn) xoá ảnh cũ
          if (user.avatar) {
            try {
              fs.unlinkSync(path.resolve(process.cwd(), user.avatar));
            } catch {}
          }
          user.avatar = path.relative(process.cwd(), req.file.path);
        }

        // Update các field nếu có
        if (hobby !== undefined) user.hobby = hobby;
        if (name !== undefined) user.name = name;
        if (dob !== undefined) user.dob = dob;
        if (email !== undefined) user.email = email;
        if (sex !== undefined) user.sex = sex;
        if (password !== undefined) user.password = password;

        const avatarPath = req.file ? path.relative(process.cwd(), req.file.path) : null;
        user.avatar = avatarPath;

        await user.save();

        return res.success("Update profile complete");
      } catch (innerErr) {
        return res.badRequest({innerErr});
      }
    });
  } catch (error) {
    return res.badRequest({error});
  }
};

const register = async (req, res) => {
  try {
    const { name, username, password, email, dob, sex } = req.body;

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

    // Tạo user (Mongoose)
    const newUser = await User.create({
      name,
      username,
      password: cryptedPassword,
      email,
      dob,
      sex,
      tick: false,
      type: "khong",
    });
    return res.success(newUser, "User registered successfully");
  } catch (Err) {
    return res.badRequest(Err.message || "Registration failed");
  }
};

const getAvatarBinary = async (req, res) => {
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
    res.setHeader(
      "Content-Type",
      mime.lookup(absPath) || "application/octet-stream"
    );
    res.setHeader("Content-Length", stat.size.toString());
    res.setHeader("Last-Modified", stat.mtime.toUTCString());
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${path.basename(absPath).replace(/"/g, "")}"`
    );

    fs.createReadStream(absPath)
      .on("error", () => res.status(500).end())
      .pipe(res);
  } catch (e) {
    return res.badRequest(e.message || "Get avatar failed");
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
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
      hobby: checkUser.hobby,
      sex: checkUser.sex,
      name: checkUser.name,
      type: checkUser.type,
      tick: checkUser.tick,
    };
    return res.success(userData, "Login successful");
  } catch (error) {
    return res.badRequest(error.message || "Login failed");
  }
};

const updateTick = async (req, res) => {
  const { userID } = req.body;
  try {
    const userUpdate = await User.findByIdAndUpdate(
      userID,
      { $set: { tick: true } },
      { new: true }
    );
    if (!userUpdate) {
      return res.badRequest("User not found");
    }
    return res.success(userUpdate, "Tick updated successfully");
  } catch (error) {
    return res.badRequest(error.message || "Update tick failed");
  }
};

module.exports = {
  register,
  getAvatarBinary,
  login,
  updateTick,
  assignType,
  updateProfile
};
