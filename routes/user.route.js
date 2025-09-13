const router = require("express").Router();
const controller = require("../controllers/user.controller");

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:   # gửi JSON vì không upload file
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               username:
 *                 type: string
 *                 example: nguyenvana
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nguyenvana@example.com
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               sex:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *     responses:
 *       200:
 *         description: Người dùng được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64d3c51f5c0a1b2c3d4e5f6a
 *                     name:
 *                       type: string
 *                       example: Nguyễn Văn A
 *                     username:
 *                       type: string
 *                       example: nguyenvana
 *                     email:
 *                       type: string
 *                       example: nguyenvana@example.com
 *                     dob:
 *                       type: string
 *                       format: date
 *                       example: 2000-01-01
 *                     sex:
 *                       type: string
 *                       example: male
 *                     tick:
 *                       type: boolean
 *                       example: false
 *                     type:
 *                       type: string
 *                       example: khong
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc username đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Username already exists
 */
router.post("/register", controller.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *             example:
 *               username: 'Nguyen Van A'
 *               password: 'masadthu123'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: login successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.post("/login", controller.login);

/**
 * @swagger
 * /user/update-tick:
 *   post:
 *     summary: Đổi trạng thái tick của người dùng
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *             required:
 *               - userID
 *             example:
 *               userID: '6867d87da4831915f05394f6'
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái tick thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Tick updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: ❌ Lỗi khi cập nhật trạng thái tick (userID không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Cast to ObjectId failed for value "6867d87da4831915f053" (type string) at path "_id" for model "user"
 *             examples:
 *               invalidId:
 *                 summary: ObjectId không hợp lệ
 *                 value:
 *                   status: error
 *                   message: 'Cast to ObjectId failed for value "6867..."'
 */
router.post("/update-tick", controller.updateTick);

/**
 * @swagger
 * /user/get-avatar/{username}:
 *   get:
 *     summary: Lấy ảnh avatar của người dùng
 *     tags:
 *       - User
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên đăng nhập của user
 *         example: nguyenvana
 *     responses:
 *       200:
 *         description: Trả về file ảnh avatar
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid avatar path
 *       404:
 *         description: Không tìm thấy avatar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not found
 */
router.get("/get-avatar/:username", controller.getAvatarBinary);

/**
 * @swagger
 * /user/assign-type/{userID}:
 *   post:
 *     summary: Gán loại người dùng dựa trên điểm số
 *     tags:
 *       - User
 *     parameters:
 *       - name: userID
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng trong MongoDB
 *         example: 6867d87da4831915f05394f6
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               point:
 *                 type: integer
 *                 description: Điểm số để xác định loại user
 *                 example: 12
 *     responses:
 *       200:
 *         description: Gán loại thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Assign type successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Lỗi khi gán loại (userID hoặc point không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Point phải là số
 *       404:
 *         description: Không tìm thấy user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.post("/assign-type/:userID", controller.assignType);

/**
 * @swagger
 * /user/update-profile/{username}:
 *   post:
 *     summary: Cập nhật thông tin hồ sơ người dùng (có thể kèm avatar)
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên người dùng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn B
 *               hobby:
 *                 type: string
 *                 example: Đọc sách
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 2001-05-20
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nguyenvanb@example.com
 *               sex:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newpassword123
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật hồ sơ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Profile updated successfully
 *                     user:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                           example: Supreme3Bye
 *                         name:
 *                           type: string
 *                           example: Nguyễn Văn B
 *                         email:
 *                           type: string
 *                           example: nguyenvanb@example.com
 *                         hobby:
 *                           type: string
 *                           example: Đọc sách
 *                         dob:
 *                           type: string
 *                           format: date
 *                           example: 2001-05-20
 *                         sex:
 *                           type: string
 *                           example: male
 *                         avatar:
 *                           type: string
 *                           example: avatars/Supreme3Bye/1726223456789-avatar.webp
 *       400:
 *         description: Lỗi dữ liệu hoặc không tìm thấy user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.post("/update-profile/:username", controller.updateProfile);

module.exports = router;
