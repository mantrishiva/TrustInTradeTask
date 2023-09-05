const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./users.db', (err) => {
    if(err){
        console.error(err.message);
    } else {
        console.log('Conneted to the users Databases');
    }
})


// db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Close the database connection.');
// });

module.exports = db;