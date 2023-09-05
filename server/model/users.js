const db = require('../db');

const createUserTable = () => {
    const query = ` CREATE TABLE IF NOT EXISTS USERS(
        id TEXT PRIMARY KEY,
        full_name TEXT,
        email TEXT,
        status TEXT,
        password TEXT,
        gender TEXT,
        date_of_birth TEXT,
        created_at DATETIME,
        created_by TEXT
    )`;
    db.run(query);
}

const creatateMarchantTable = () => {
    const query = `CREATE TABLE IF NOT EXISTS MARCHANT(
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        status TEXT,
        date_found DATETIME,
        created_at DATETIME,
        created_by TEXT,
        FOREIGN KEY (created_by) REFERENCES users (id)
    )`;
    db.run(query);
}

const createProductTable = () => {
    const query = `CREATE TABLE IF NOT EXISTS PRODUCT(
        id TEXT PRIMARY KEY,
        name TEXT,
        merchant_id text,
        price INTEGER,
        status TEXT,
        created_at DATETIME,
        created_by TEXT,
        FOREIGN KEY (merchant_id) REFERENCES marchant (id),
        FOREIGN KEY (created_by) REFERENCES users (id)
    )`;
    db.run(query);
}

const createMerchantIUserTable = () => {
    const query = `CREATE TABLE IF NOT EXISTS MarchantUsers(
        id TEXT PRIMARY KEY,
        name TEXT,
        user_id TEXT,
        role TEXT,
        merchant_id text,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (merchant_id) REFERENCES marchant (id)
    )`;
    db.run(query);
}

const roleTable = () => {
    const query = `CREATE TABLE IF NOT EXISTS role(
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        role TEXT
    )`
    db.run(query);
}

const insertRoleData = (id, name, email, role) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO role(id, name, email,  role) VALUES(?, ?, ?, ?)`
        db.run(query, [id, name, email, role], (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            console.log('insert role', data);
            resolve('role inserted successfully')
        })
    })
}

const getRole = (email) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM role WHERE email=?`;
        db.all(query, [email], (err, data) => {
            if (err) {
                console.log('role err', err); reject(err)
            };
            console.log('role....', data, err);
            resolve(data)
        })
    })
}

const insertUserData = (userId, name, email, status, password, gender, dob, createdAt, createdBy) => {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO USERS (id, full_name, email, status, password, gender, date_of_birth, created_at, created_by) VALUES (?, ?, ?, ?,  ?, ?, ?, ?, ?)
    `;
        db.all('SELECT * FROM USERS WHERE email=?', [email], (err, data) => {
            if (err || data.length < 1) {
                db.run(query, [userId, name, email, status, password, gender, dob, createdAt, createdBy], (err, data) => {
                    if (err) {
                        reject("user not added")
                    } else {
                        resolve('Item inserted successfully');

                    }
                });
            } else {
                reject('user already exists');
            }
        });
    })
};

const getAllUsers = (callback) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT * FROM USERS
    `;

        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error retrieving items:', err);
            } else {
                resolve(rows)
            }
        });

    });
};

const getUser = (email) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM USERS WHERE email=?', [email], (err, data) => {
            console.log('err', err);
            if (err) reject('user not found')
            resolve(data)
        })
    })
}

const addMarchant = (id, name, email, status, date_found, created_at, created_by) => {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO MARCHANT (id,name, email, status, date_found, created_at, created_by) VALUES (?, ?, ?, ?,  ?, ?, ?)
    `;
        db.run('SELECT * FROM MARCHANT WHERE created_by=?', [created_by], (err, data) => {
            if (err) {
                db.run(query, [id, name, email, status, date_found, created_at, created_by], (err, data) => {
                    if (err) {
                        console.log('err', err);
                        reject("user not added")
                    } else {
                        console.log('add marchant', data);
                        resolve('Item inserted successfully');

                    }
                });
            } else {
                reject('u are already marchant')
            }
        })

    })
}

const checkMarchant = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM MARCHANT WHERE created_by=?`
        db.all(query, [id], (err, data) => {
            if (err) {
                reject()
            } else {
                resolve(data)
            }
        })
    })
}

const addProduct = (id, name, merchantId, price, status, createdAt, createdBy) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO PRODUCT (id, name, merchant_id, price, status, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [id, name, merchantId, price, status, createdAt, createdBy], (err, data) => {
            if (err) reject('product not inserted');
            resolve('product inserted successfully');
        });
    });
}

const addMarchantUser = (id, name, userId, role, marchantId) => {
    return new Promise((resolve, reject) => {
        console.log('log at marchant user', id, name, userId, role, marchantId);
        const query = `INSERT INTO MARCHANTUSERS (id, name, user_id, role, merchant_id) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [id, name, userId, role, marchantId], (err, data) => {
            if (err) {
                console.log(err);
                reject('marchant user not inserted')
            };
            console.log(data);
            resolve('user inserted successfully');
        })
    })
}

const getMarchantUsers = (marchantId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM MARCHANTUSERS WHERE merchant_id=?`;
        db.all(query, [marchantId], (err, data) => {
            if (err) { reject(err) };
            resolve(data)
        })
    })
}

const getAllMarchants = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM MARCHANTUSERS`;
        db.all(query, (err, data) => {
            if (err) reject(err);
            resolve(data)
        })
    })
}

const getMarchantProducts = (marchantId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM PRODUCT WHERE merchant_id=?`;
        db.all(query, [marchantId], (err, data) => {
            if (err) {
                console.log('err ', err);
                reject(err)
            };
            console.log(data);
            resolve(data);
        })
    })
}

const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM PRODUCT`
        db.all(query, (err, data) => {
            if (err) {
                console.log('err ', err);
                reject(err)
            };
            console.log(data);
            resolve(data);
        })
    })
}

const verifyMarchants = (verify, id) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE MARCHANT SET status=? WHERE id=?`;
        db.run(query, [verify, id], (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

const verifyProducts = (verify, id) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE PRODUCT SET status=? WHERE id=?`;
        db.run(query, [verify, id], (err,data) => {
            if(err) reject(err)
            resolve(data)
        })
    })
}


module.exports = { createUserTable, insertUserData, getAllUsers, getUser, addMarchant, creatateMarchantTable, checkMarchant, addProduct, createProductTable, createMerchantIUserTable, roleTable, addMarchantUser, getMarchantUsers, getMarchantProducts, getAllProducts, insertRoleData, getRole, getAllMarchants, verifyMarchants, verifyProducts }