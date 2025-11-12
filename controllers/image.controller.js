const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const sharp = require("sharp");
const User = require("../models/user.model.js");
const Image = require("../models/image.model.js");
const mime = require("mime-types");

const uploadMany = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 2,
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Chỉ chấp nhận ảnh jpeg/png/webp"));
    }
    cb(null, true);
  },
}).array("images");

function toSafeBase(originalname) {
  const ext = path.extname(originalname || "").toLowerCase();
  return path
    .basename(originalname || "image", ext)
    .replace(/[^a-z0-9-_]/gi, "_")
    .toLowerCase();
}

const IMAGES_ROOT = path.resolve(process.cwd(), "images");

function isUnder(base, target) {
  const rel = path.relative(base, target);
  return !!rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}

async function uploadImages(req, res) {
  uploadMany(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const userId = req.user?._id || req.body.userId;
      if (!userId) throw new Error("Thiếu userId");
      const user = await User.findById(userId);
      if (!user) throw new Error("User không tồn tại");
      const username = user.username;
      if (!username) throw new Error("Thiếu username");

      const files = req.files || [];
      if (files.length < 2) {
        return res.status(400).json({ error: "Cần tải lên ít nhất 2 ảnh." });
      }

      const fmt = (req.query.format || "jpg").toLowerCase();
      const width = Math.min(parseInt(req.query.w) || 1280, 4096);
      const quality = Math.min(parseInt(req.query.q) || 80, 100);

      const userDir = path.resolve(process.cwd(), "images", username);
      await fsp.mkdir(userDir, { recursive: true });

      const stamp = Date.now();

      const processed = await Promise.all(
        files.map(async (f, idx) => {
          const base = toSafeBase(f.originalname);
          let pipeline = sharp(f.buffer)
            .rotate()
            .resize({ width, fit: "inside", withoutEnlargement: true });

          let extOut, encoder;
          if (fmt === "png") {
            encoder = pipeline.png({ compressionLevel: 8 });
            extOut = "png";
          } else {
            encoder = pipeline.jpeg({ quality, mozjpeg: true });
            extOut = "jpg";
          }

          const outName = `${stamp}-${base}_${idx}.${extOut}`;
          const outPath = path.join(userDir, outName);
          await encoder.toFile(outPath);

          const rel = path.relative(process.cwd(), outPath).replace(/\\/g, "/");
          return { rel, url: `/${rel}` };
        })
      );

      const docsToSave = processed.map((p) => ({
        userId,
        dir: p.rel,
        approve: false,
      }));
      const saved = await Image.insertMany(docsToSave);

      return res.status(201).json({
        message: "Upload các ảnh thành công",
        count: saved.length,
        items: saved.map((doc, i) => ({
          _id: doc._id,
          userId: doc.userId,
          dir: doc.dir,
          approve: doc.approve,
        })),
      });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  });
}

async function imageApprove(req, res) {
  try {
    const { imageId } = req.params;
    const { approve } = req.body;

    const image = await Image.findById(imageId);

    if (approve === true) {
      image.approve = true;
      await image.save();
      return res.status(200).json({ message: "Duyệt ảnh thành công" });
    }

    const user = await User.findById(image.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const userDir = path.resolve(IMAGES_ROOT, user.username);
    if (isUnder(IMAGES_ROOT, userDir)) {
      try {
        await fsp.rm(userDir, { recursive: true, force: true });
      } catch (e) {
        console.warn("Không thể xóa thư mục:", e.message);
      }
    }

    await Image.deleteMany({ userId: user._id });

    return res
      .status(200)
      .json({ message: `Đã xoá toàn bộ thư mục ảnh của ${user.username}` });
  } catch (err) {
    return res.status(400).json({ error: err.message || "Approve failed" });
  }
}

async function getImageBinary(req, res) {
  try {
    const { imageId } = req.params;
    const image = await Image.findById(imageId);
    const absPath = path.isAbsolute(image.dir)
      ? image.dir
      : path.resolve(process.cwd(), image.dir);

    if (!isUnder(IMAGES_ROOT, absPath)) {
      return res.status(400).json({ error: "Invalid image path" });
    }
    await fsp.access(absPath, fs.constants.R_OK);
    const stat = await fsp.stat(absPath);

    const ct = (mime && mime.lookup(absPath)) || undefined;
    if (ct) res.setHeader("Content-Type", ct);
    else res.type(path.extname(absPath)); // fallback

    res.setHeader("Content-Length", String(stat.size));
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
    return res.status(400).json({ error: e.message });
  }
}

module.exports = { uploadImages, imageApprove, getImageBinary };
