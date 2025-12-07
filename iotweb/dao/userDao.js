const { execPoolSQL } = require('../utils/dbUtil');

function findUserByUsername(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE username = ?';
        execPoolSQL(sql, [username], (result) => {
            if (result && result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports = {
    findUserByUsername
};