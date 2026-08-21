const db = require('../config/db')

const findUserByEmail = (email, callback) => {
    const sql =
        `SELECT * FROM users WHERE email=?`;

    db.query(sql, [email], callback)
};

const createUser = (name, email, phone, password, callback) => {
    const sql =
        `INSERT INTO users (name,email,phone,password)
        VALUES(?,?,?,?)`;

    db.query(
        sql,
        [name, email, phone, password],
        callback
    );
}

module.exports = {
    findUserByEmail,
    createUser
}