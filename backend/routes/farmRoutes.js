const express = require('express')
const {
    addFarm,
    getFarm,
    getFarms
} = require('../controller/farmController')

const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', authMiddleware, addFarm);

router.get('/', authMiddleware, getFarms);

router.get('/:id', authMiddleware, getFarm);

module.exports = router;