const db = require('../config/db')
const createFarm = (userId, farmName, location, landArea, callback) => {
    const sql =
        `INSERT INTO farms (user_id, farm_name, location , land_area)
    VALUES
    (?,?,?,?)`;

    db.query(
        sql,
        [userId, farmName, location, landArea],
        callback
    );
};

const getFarmerByUser = (userId, callback) => {
    const sql =
        `SELECT * FROM farms 
    WHERE user_id=?
    ORDER BY created_at DESC`;

    db.query(sql, [userId], callback);
};

const getFarmById = (farmId, userId, callback) => {
    const sql =
        `SELECT * FROM farms 
    WHERE id=? AND user_id=?`;

    db.query(sql, [farmId, userId], callback);
}

module.exports = {
    createFarm,
    getFarmById,
    getFarmerByUser
}