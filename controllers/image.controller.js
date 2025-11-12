const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const sharp = require("sharp");
const User = require("../models/user.model.js");
const Image = require("../models/image.model.js");

const uploadMany = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 12,
    fileSize: 10 * 1024 * 1024,
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

module.exports = { uploadImages };
