const db = require('../config/db');

const createFarm = (
    farmId,
    cropName,
    area,
    sowingDate,
    harvestDate,
    status,
    callback
) => {
    const sql =
        `INSERT INTO crops
    (farm_id, crop_name,area, sowing_date, harvest_date, status)
    VALUES(?,?,?,?,?,?)`;

    db.query(
        sql,
        [
            farmId,
            cropName,
            area,
            sowingDate,
            harvestDate,
            status
        ],
        callback
    );
};

const getCropByUser = (userId, callback) => {
    const sql = `
        SELECT
            crops.id,
            crops.farm_id,
            crops.crop_name,
            crops.area,
            crops.sowing_date,
            crops.harvest_date,
            crops.status,
            crops.created_at,
            farms.farm_name
        FROM crops
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE farms.user_id = ?
        ORDER BY crops.created_at DESC
    `;

    db.query(sql, [userId], callback);
};

const getCropById = (cropId, userId, callback) => {
    const sql = `
        SELECT
            crops.id,
            crops.farm_id,
            crops.crop_name,
            crops.area,
            crops.sowing_date,
            crops.harvest_date,
            crops.status,
            crops.created_at,
            farms.farm_name
        FROM crops
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE crops.id = ?
          AND farms.user_id = ?
    `;

    db.query(sql, [cropId, userId], callback);
};

const updateCrop = (
    cropId,
    userId,
    cropName,
    area,
    sowingDate,
    harvestDate,
    status,
    callback
) => {
    const sql = `
        UPDATE crops
        INNER JOIN farms
            ON crops.farm_id = farms.id
        SET
            crops.crop_name = ?,
            crops.area = ?,
            crops.sowing_date = ?,
            crops.harvest_date = ?,
            crops.status = ?
        WHERE crops.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [
            cropName,
            area,
            sowingDate,
            harvestDate,
            status,
            cropId,
            userId
        ],
        callback
    );
};

const deleteCrop = (cropId, userId, callback) => {
    const sql = `
     DELETE crops
        FROM crops
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE crops.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [cropId, userId],
        callback
    );
};
module.exports = {
    createFarm,
    getCropByUser,
    getCropById,
    updateCrop,
    deleteCrop
}