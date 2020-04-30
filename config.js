//app.listen()
module.exports.main_port = 3000;

//Подключение к БД sqlite3/main.db Windows
module.exports.dbConfig = {
    dialect: 'sqlite',
    storage: './sqlite3/main.db'
};

//module.exports.dbConfig = {
//    dialect: 'sqlite',
//    storage: './sqlite3_linux/main.db'
//};
