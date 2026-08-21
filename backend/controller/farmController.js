const {
    createFarm,
    getFarmerByUser,
    getFarmById
} = require('../models/farmModel');

const addFarm = (req, res) => {
    const { farm_name, location, land_area } = req.body;

    if (!farm_name || !land_area) {
        return res.status(400).json({
            message: 'Farm name and land Area are required'
        });
    }

    const userId = req.user.id;

    createFarm(
        userId,
        farm_name,
        location || null,
        land_area,
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to create farm'
                });
            }

            res.status(201).json({
                message: 'Farm created successfully',
                farmId: result.insertId
            });
        }
    );
};

const getFarms = (req, res) => {
    const userId = req.user.id;

    getFarmerByUser(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch farms"
            });
        }

        res.status(200).json({
            farms: results
        });
    });
};
const getFarm = (req, res) => {
    const farmId = req.params.id;
    const userId = req.user.id;

    getFarmById(farmId, userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch farm"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Farm not found"
            });
        }

        res.status(200).json({
            farm: results[0]
        });
    });
};

module.exports = {
    addFarm,
    getFarm,
    getFarms
}