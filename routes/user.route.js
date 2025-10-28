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

/**
 * @swagger
 * /user/sum-type:
 *   get:
 *     summary: Đếm số lượng người dùng theo type (hoặc tất cả nếu không truyền)
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           Giá trị `type` để lọc (ví dụ: "Người quan sát", "Người sáng tạo").
 *           Bỏ trống để đếm tất cả.
 *     responses:
 *       200:
 *         description: Đếm thành công
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
 *                   example: Sum type successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: Người quan sát
 *                     count:
 *                       type: integer
 *                       example: 42
 *             examples:
 *               withType:
 *                 summary: Có truyền type
 *                 value:
 *                   status: success
 *                   message: Sum type successfully
 *                   data:
 *                     type: Người quan sát
 *                     count: 42
 *               withoutType:
 *                 summary: Không truyền type (đếm tất cả)
 *                 value:
 *                   status: success
 *                   message: Sum type successfully
 *                   data:
 *                     type: ""
 *                     count: 187
 *       400:
 *         description: Lỗi dữ liệu
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
 *                   example: Sum type failed
 */
router.get("/sum-type", controller.sumType);

/**
 * @swagger
 * /user/list-user:
 *   get:
 *     summary: Lấy danh sách người dùng (ẩn trường password) có phân trang
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         required: false
 *         description: Trang hiện tại (bắt đầu từ 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         required: false
 *         description: Số bản ghi mỗi trang (tối đa 100)
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
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
 *                   example: List user successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserPublic'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 187
 *                         totalPages:
 *                           type: integer
 *                           example: 19
 *                         hasNextPage:
 *                           type: boolean
 *                           example: true
 *                         hasPrevPage:
 *                           type: boolean
 *                           example: false
 *             examples:
 *               ok:
 *                 summary: Ví dụ phản hồi thành công
 *                 value:
 *                   status: success
 *                   message: List user successfully
 *                   data:
 *                     items:
 *                       - _id: "64adbc2f8ee9c9f1b4d9d4d5"
 *                         username: "Supreme3Bye"
 *                         name: "Nguyễn Văn B"
 *                         email: "nguyenvanb@example.com"
 *                         hobby: "Đọc sách"
 *                         dob: "2001-05-20"
 *                         sex: "male"
 *                         type: "student"
 *                         avatar: "avatars/Supreme3Bye/1726223456789-avatar.webp"
 *                       - _id: "64adbc2f8ee9c9f1b4d9d4d6"
 *                         username: "Alice01"
 *                         name: "Alice"
 *                         email: "alice@example.com"
 *                         hobby: "Âm nhạc"
 *                         dob: "2000-01-15"
 *                         sex: "female"
 *                         type: "admin"
 *                         avatar: "avatars/Alice01/1726223456790-avatar.jpg"
 *                     pagination:
 *                       page: 1
 *                       limit: 10
 *                       total: 187
 *                       totalPages: 19
 *                       hasNextPage: true
 *                       hasPrevPage: false
 *       400:
 *         description: Lỗi dữ liệu
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
 *                   example: List user failed
 *
 * components:
 *   schemas:
 *     UserPublic:
 *       type: object
 *       description: >
 *         Thông tin người dùng trả về trên API công khai. Trường password đã được loại bỏ.
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: 64adbc2f8ee9c9f1b4d9d4d5
 *         username:
 *           type: string
 *           example: Supreme3Bye
 *         name:
 *           type: string
 *           example: Nguyễn Văn B
 *         email:
 *           type: string
 *           format: email
 *           example: nguyenvanb@example.com
 *         hobby:
 *           type: string
 *           example: Đọc sách
 *         dob:
 *           type: string
 *           format: date
 *           example: 2001-05-20
 *         sex:
 *           type: string
 *           enum: [male, female, other]
 *           example: male
 *         type:
 *           type: string
 *           example: student
 *         avatar:
 *           type: string
 *           example: avatars/Supreme3Bye/1726223456789-avatar.webp
 */
router.get("/list-user", controller.listUser);

/**
 * @swagger
 * /user/summary:
 *   get:
 *     summary: Thống kê số lượng người dùng theo type và tổng số
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
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
 *                   example: Summary users successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 187
 *                     byType:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         Người quan sát: 42
 *                         Người kết nối: 88
 *                         Người sáng tạo: 57
 *       400:
 *         description: Lỗi dữ liệu
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
 *                   example: Summary users failed
 */
router.get("/summary", controller.summaryUsers);

module.exports = router;
