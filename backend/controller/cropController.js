const {
    createFarm,
    getCropByUser,
    getCropById,
    deleteCrop,
    updateCrop
} = require("../models/cropModel");

const db = require("../config/db");

// Create crop
const addCrop = (req, res) => {
    const {
        farm_id,
        crop_name,
        area,
        sowing_date,
        harvest_date,
        status
    } = req.body;

    if (!farm_id || !crop_name || !area) {
        return res.status(400).json({
            message: "Farm ID, crop name and area are required"
        });
    }

    const userId = req.user.id;

    // Check whether the farm belongs to the logged-in user
    const sql = `
        SELECT id
        FROM farms
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [farm_id, userId], (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(403).json({
                message: "You do not have access to this farm"
            });
        }

        // Farm belongs to user, so create crop
        createFarm(
            farm_id,
            crop_name,
            area,
            sowing_date || null,
            harvest_date || null,
            status || "Planned",
            (err, result) => {
                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: "Failed to create crop"
                    });
                }

                return res.status(201).json({
                    message: "Crop created successfully",
                    cropId: result.insertId
                });
            }
        );
    });
};

// Get all crops
const getCrops = (req, res) => {
    const userId = req.user.id;

    getCropByUser(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch crops"
            });
        }

        return res.status(200).json({
            crops: results
        });
    });
};

// Get one crop
const getCrop = (req, res) => {
    const cropId = req.params.id;
    const userId = req.user.id;

    getCropById(cropId, userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch crop"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Crop not found"
            });
        }

        return res.status(200).json({
            crop: results[0]
        });
    });
};


const editCrop = (req, res) => {
    const cropId = req.params.id;
    const userId = req.user.id;
    const {
        crop_name,
        area,
        sowing_date,
        harvest_date,
        status
    } = req.body;

    if (!crop_name || !area) {
        return res.status(400).json({
            message: 'Crop name and area are required'
        });
    }

    updateCrop(
        cropId,
        userId,
        crop_name,
        area,
        sowing_date || null,
        harvest_date || null,
        status || 'Planned',
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to update crop'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Crop not found'
                });
            }

            return res.status(200).json({
                message: 'Crop updated successfully'
            });
        }
    );
};

const removeCrop = (req, res) => {
    const cropId = req.params.id;
    const userId = req.user.id;

    deleteCrop(cropId, userId, (err, result) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to delete crop"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Crop not found"
            });
        }

        return res.status(200).json({
            message: "Crop deleted successfully"
        });
    });
};
module.exports = {
    addCrop,
    getCrops,
    getCrop,
    editCrop,
    removeCrop
};