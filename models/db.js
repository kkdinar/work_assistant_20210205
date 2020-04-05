const config = require('../config');
const {
    Sequelize,
    DataTypes
} = require('sequelize');
const sequelize = new Sequelize(config.dbConfig);
const db = {};

toDate = (d) => {
    let date = new Date(d);
    let month = date.getMonth() + 1;
    return date.getDate() + '.' + month + '.' + date.getFullYear();
};

db.Sequelize = Sequelize; //модуль Sequelize
db.sequelize = sequelize; //подключение к нашей базе
//таблица Главная
//db.Main = require("./main.js")(sequelize, Sequelize);
//таблица пользователей
const Users = require("./users.js")(sequelize, Sequelize);
db.Users = Users;
//таблица справочников
//db.Dictionarys = require("./dictionarys.js")(sequelize, Sequelize); 
//таблица документов
const Documents = require("./documents.js")(sequelize, Sequelize);
db.Documents = Documents;
//таблица со столбцами документов
const DocColumns = require("./docColumns.js")(sequelize, Sequelize);
db.DocColumns = DocColumns;

db.getJournal = async (docID) => {
    let rows = {};
    let doc = await Documents.findByPk(docID);
    let Doc = sequelize.define(doc.Name, {}, {
        sequelize,
        modelName: doc.Name,
        freezeTableName: true //Таблица называется как модель);
    });
    await Doc.findAll().map(row => rows[row.id] = '№ ' + row.id + ' от ' + toDate(row.createdAt));
    return rows;
};

db.getDoc = async (docID, id) => {
    let rows = {};
    let doc = {};
    switch (docID) {
        case '3': //users
            doc = {
                Name: 'users'
            };
            break;
        default:
            doc = await Documents.findByPk(docID);
            break;
    };
    let columns = await DocColumns.findAll({
        where: {
            TableId: docID
        }
    });
    //console.log('columns=', columns);
    let Columns = {};
    columns.forEach(row => {
        Columns[row.Name] = {
            type: DataTypes[row.Type],
        }
    });
    let Doc = sequelize.define(doc.Name, Columns, {
        sequelize,
        modelName: doc.Name,
        freezeTableName: true //Таблица называется как модель);
    });

    rows = await Doc.findByPk(id);
    //console.log('rows=',rows);

    return rows;
};

db.getDocColumnsTypes = async (docID) => {
    let rows = {}
    await DocColumns.findAll({
        where: {
            TableId: docID
        }
    }).map(row => rows[row.Name] = row.Type);
    console.log('getDocColumnsTypes=',rows);
    
    return rows;
};

db.getDocColumns = async (docID) => {
    let rows = {}
    await DocColumns.findAll({
        where: {
            TableId: docID
        }
    }).map(row => rows[row.id] = row.Name);
    return rows;
};

db.createTable = async (docColumns) => {
    console.log('docColumns=', docColumns);

    let Doc = sequelize.define(docColumns.Name, {}, {
        sequelize,
        modelName: docColumns.Name,
        freezeTableName: true //Таблица называется как модель);
    });
    let response = Doc.sync({
        force: true
    });
    return response;
};

db.addDoc = async (docID) => {
    let response;
    let doc = await Documents.findByPk(docID);
    if (!doc) return response.error = "Error, dont find table in db";
    let Doc = sequelize.define(doc.Name, {}, {
        sequelize,
        modelName: doc.Name,
        freezeTableName: true //Таблица называется как модель);
    });
    response = await Doc.create();
    return response;
};

db.addDocColumn = async (docID, docColumns) => {
    let doc = {};
    switch (docID) {
        case '3': //users
            doc = {
                Name: 'users'
            };
            break;
        default:
            doc = await Documents.findByPk(docID);
            break;
    };

    let columns = await DocColumns.findAll({
        where: {
            TableId: docID
        }
    });
    //console.log('columns=', columns);
    let Columns = {};
    columns.forEach(row => {
        Columns[row.Name] = {
            type: DataTypes[row.Type],
        }
    });
    //Добавляем новое поле в саму таблицу
    Columns[docColumns.Name] = {
        type: DataTypes[docColumns.dataTypes],
    };
    let Doc = sequelize.define(doc.Name, Columns, {
        sequelize,
        modelName: doc.Name,
        freezeTableName: true //Таблица называется как модель);
    });
    //Добавляем поле в таблицу DocColumns
    await DocColumns.create({
        TableId: docID,
        Name: docColumns.Name,
        ColumnName: docColumns.Name,
        Type: docColumns.dataTypes,
        DictionaryId: 0
    });
    let response = await Doc.sync({
        alter: true
    });
    return response;
};

db.updateDocColumns = async (docID, id, docColumns) => {
    let doc = await Documents.findByPk(docID);
    let columns = await DocColumns.findAll({
        where: {
            TableId: docID
        }
    });
    //console.log('columns=', columns);
    let Columns = {};
    columns.forEach(row => {
        Columns[row.Name] = {
            type: DataTypes[row.Type],
        }
    });
    let Doc = sequelize.define(doc.Name, Columns, {
        sequelize,
        modelName: doc.Name,
        freezeTableName: true //Таблица называется как модель);
    });
    let Model = await Doc.findByPk(id);

    console.log('docColumns=', docColumns);
    let updateDocColumns = {};
    //Не меняем поля id, createdAt, updatedAt
    Object.entries(docColumns).map(([key, value]) => {
        if (key != 'id')
            if (key != 'createdAt')
                if (key != 'updatedAt') updateDocColumns[key] = value;
    });
    let response = Model.update(updateDocColumns, {
        where: {
            id: id
        }
    });

    return response;
};

db.deleteDocById = async (docID, id) => {
    let doc = await Documents.findByPk(docID);
    let Doc = sequelize.define(doc.Name, {}, {
        sequelize,
        modelName: doc.Name,
        freezeTableName: true //Таблица называется как модель);
    });
    let response = await Doc.destroy({
        where: {
            id: id
        }
    });
    return response;
};

db.deleteDocColumn = async (docID, id) => {
    let response = await DocColumns.destroy({
        where: {
            TableId: docID,
            id
        }
    });
    return response;
};
/*
db.destroyDocType = async ({
    Obj
}) => {
    let Name = Obj.Name;
    let Doc = sequelize.define(Name, {}, {
        sequelize,
        modelName: Name
    });
    return Doc.drop();
};
*/
db.testDbConnection = async () => {
    //Подключение к базе 
    //const sequelize = new Sequelize(config.dbConfig);
    //Проверка соединения с базой
    let message;
    await sequelize
        .authenticate()
        .then(() => {
            message = 'Проверка подключения к Базе данных прошла успешно.';
        })
        .catch(err => {
            message = 'Ошибка при подключении к Базе данных:' + err;
        });

    //Закрываем соединение с базой
    //sequelize.close();

    return message;
};

db.createDB = async (force, alter) => {
    let message;
    //{force: true} - удалить таблицы и создать их заново, но уже с нужной нам структурой
    if (force == true) {
        await sequelize
            .sync({
                force: true
            })
            .then(result => {
                message = 'Синхронизация таблиц прошла успешно \n';
                Documents.create({
                    Name: 'Проверить подключение к Базе данных',
                    Table: 'testDbConnection',
                    Users: ',admin,'
                });
                Documents.create({
                    Name: 'Создать Базу данных',
                    Table: 'createDB',
                    Users: ',admin,'
                });
                Documents.create({
                    Name: 'Пользователи',
                    Table: 'users',
                    Users: ',admin,'
                });
                Users.create({
                    Логин: "admin",
                    Пароль: "admin",
                    ФИО: "admin"
                });
                DocColumns.create({
                    TableId: '3',
                    Name: 'Логин',
                    ColumnName: 'Логин',
                    Type: 'TEXT'
                });
                DocColumns.create({
                    TableId: '3',
                    Name: 'Пароль',
                    ColumnName: 'Пароль',
                    Type: 'TEXT'
                });
                DocColumns.create({
                    TableId: '3',
                    Name: 'ФИО',
                    ColumnName: 'ФИО',
                    Type: 'TEXT'
                });
            })
            .catch(err => message = 'Синхронизация таблиц прошла НЕ успешно \n' + err);
    }
    //{alter: true} - обновить базу, добавить новые таблицы и столбцы
    if (alter == true) {
        await sequelize
            .sync({
                alter: true
            })
            .then(result => message = 'Синхронизация таблиц прошла успешно \n')
            .catch(err => message = 'Синхронизация таблиц прошла НЕ успешно \n' + err);
    }
    return message;
};

module.exports = db;