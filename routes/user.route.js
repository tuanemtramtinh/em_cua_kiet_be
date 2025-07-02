const router = require('express').Router();
const controller = require('../controllers/user.controller');

router.get('/test', controller.test);

module.exports = router;