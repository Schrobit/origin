const mysql = require('mysql2');

const cfg = {
    host: 'localhost',
    user: 'root',
    password: '330683',
    database: 'iot'
}

const g_conn = mysql.createConnection(cfg);

const myPool = mysql.createPool(cfg);

// 连接池方式
function execPoolSQL(sql, params, callback){
    myPool.getConnection((err, conn) => { 
        if(err) throw err;
        conn.query(sql, params, (err1, result) => {
            if(err1) {
                throw err1;
            }
            callback(result);
            conn.release();
        });
    });
}

// 非连接池方式
function execSQL(sql, params, callback){
    g_conn.connect((err) => {
        if (err) throw err;
        g_conn.query(sql, params, (err, result) => {
            if(err) {
                throw err;
            }
            callback(result);
            g_conn.end();
        });
    });
}

module.exports = {execSQL, execPoolSQL};

/*
execSQL("insert into tel values(?, ?, ?, ?)", [3, 10, '2025-10-20 13:15:05', '{temp: 28, humd:59}'], (result) => { 
    console.log(result);
});
execSQL('select * from tel', [], (result) => { 
    console.log(result);
})*/

/*
conn.connect((err) => {
    if (err) throw err;
    conn.query("insert into tel(id, device_id, time, value) values(2, 10, '2025-10-20 13:10:05', '{temp: 18, humd:58}')", (err1, result) => { 
        if(err1) {
            throw err1;
        }
        console.log(result);
    });
    conn.end();
})*/