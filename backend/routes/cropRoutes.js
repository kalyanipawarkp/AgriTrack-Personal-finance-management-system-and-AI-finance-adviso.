const express = require('express')

const {
    addCrop,
    getCrop,
    getCrops,
    editCrop,
    removeCrop
} = require('../controller/cropController')

const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', authMiddleware, addCrop)
router.get('/', authMiddleware, getCrops)
router.get('/:id', authMiddleware, getCrop);
router.put('/:id', authMiddleware, editCrop);
router.delete('/:id', authMiddleware, removeCrop);

module.exports = router;