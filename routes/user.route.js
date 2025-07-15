const router = require('express').Router();
const controller = require('../controllers/user.controller');

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
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
 *                   $ref: '#/components/schemas/User'
 */
router.post('/register', controller.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Đăng nhập người dùng
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
router.post('/login', controller.login);

/**
 * @swagger
 * /user/update-tick:
 *   post:
 *     summary: Đổi trạng thái tick của người dùng
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
router.post('/update-tick', controller.updateTick);

module.exports = router;