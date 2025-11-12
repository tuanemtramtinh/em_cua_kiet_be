const router = require("express").Router();
const controller = require("../controllers/image.controller");

/**
 * @swagger
 * /image/upload:
 *   post:
 *     summary: Tải lên nhiều ảnh cho người dùng (tối ưu bằng Sharp và lưu vào images/<username>/)
 *     description: |
 *       Nhận nhiều ảnh qua field **images** (multipart/form-data), xử lý bằng Sharp (resize/rotate/encode),
 *       lưu file vào thư mục `images/<username>/` và ghi metadata vào DB với `approve=false`.
 *       - Yêu cầu có `userId` (từ JWT hoặc gửi trong form).
 *       - Mặc định xuất **JPEG** chất lượng 80; có thể đổi sang **PNG** qua `?format=png`.
 *     tags:
 *       - Image
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [jpg, png]
 *           default: jpg
 *         description: Định dạng ảnh đầu ra (jpg hoặc png)
 *       - in: query
 *         name: w
 *         schema:
 *           type: integer
 *           example: 1280
 *         description: Chiều rộng tối đa sau khi resize (giữ tỉ lệ, không phóng ảnh nhỏ)
 *       - in: query
 *         name: q
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 80
 *         description: Chất lượng JPEG (bị bỏ qua với PNG)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 description: Danh sách ảnh cần tải lên
 *                 items:
 *                   type: string
 *                   format: binary
 *               userId:
 *                 type: string
 *                 description: ID người dùng (nếu không lấy từ JWT)
 *               username:
 *                 type: string
 *                 description: (Tùy chọn) Chỉ dùng khi bạn cho phép override; mặc định lấy từ DB theo userId
 *           encoding:
 *             images:
 *               contentType: image/jpeg, image/png, image/webp
 *     responses:
 *       201:
 *         description: Tải lên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload nhiều ảnh thành công
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 67331a7e6fdc530adfe5f310
 *                       userId:
 *                         type: string
 *                         example: 672fc5f8ad0ee480dd469bf3
 *                       dir:
 *                         type: string
 *                         description: Đường dẫn tương đối tới file ảnh đã lưu
 *                         example: images/tuananh/1731411800-avatar_0.jpg
 *                       approve:
 *                         type: boolean
 *                         example: false
 *                       url:
 *                         type: string
 *                         description: URL public nếu server đang serve tĩnh thư mục /images
 *                         example: /images/tuananh/1731411800-avatar_0.jpg
 *       400:
 *         description: Lỗi dữ liệu / yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     MissingUser:
 *                       value: Thiếu userId
 *                     NotEnoughFiles:
 *                       value: Cần tải lên ít nhất 2 ảnh.
 *                     InvalidType:
 *                       value: Chỉ chấp nhận ảnh jpeg/png/webp
 */
router.post("/upload", controller.uploadImages);

/**
 * @swagger
 * /image/approve/{imageId}:
 *   post:
 *     summary: Duyệt hoặc từ chối ảnh
 *     description: |
 *       - Nếu `approve = true`: đặt cờ duyệt cho ảnh có id tương ứng.
 *       - Nếu `approve = false`: xóa **tất cả ảnh** của user sở hữu ảnh đó (trong cơ sở dữ liệu).
 *     tags:
 *       - Image
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ảnh cần duyệt / từ chối
 *         example: 67331a7e6fdc530adfe5f310
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approve
 *             properties:
 *               approve:
 *                 type: boolean
 *                 description: true = duyệt ảnh; false = xóa toàn bộ ảnh thuộc user sở hữu ảnh này
 *                 example: true
 *     responses:
 *       200:
 *         description: Thao tác thành công
 *         content:
 *           application/json:
 *             oneOf:
 *               - schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Duyệt ảnh thành công
 *               - schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Xoá hai ảnh không được duyệt thành công
 *       400:
 *         description: Lỗi dữ liệu / xử lý thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     InvalidId:
 *                       value: Invalid image id
 *                     NotFound:
 *                       value: Image not found
 *                     Unknown:
 *                       value: Approve failed
 */
router.post("/approve/:imageId", controller.imageApprove);

/**
 * @swagger
 * /image/get-images/{imageId}:
 *   get:
 *     summary: Lấy ảnh (binary) theo imageId
 *     tags: [Image]
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema: { type: string }
 *         description: ObjectId của ảnh
 *         example: 6914b2eda7c46dab561dec8c
 *     responses:
 *       200:
 *         description: Ảnh binary stream
 *         content:
 *           image/jpeg:
 *             schema: { type: string, format: binary }
 *           image/png:
 *             schema: { type: string, format: binary }
 *           image/webp:
 *             schema: { type: string, format: binary }
 *       404:
 *         description: Không tìm thấy ảnh
 *       400:
 *         description: Lỗi dữ liệu / path không hợp lệ
 */
router.get("/get-images/:imageId", controller.getImageBinary);

module.exports = router;
