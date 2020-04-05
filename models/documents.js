module.exports = (sequelize, Sequelize) => {
    const Documents = sequelize.define("Documents", {
        Name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Table: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Users: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Documents',
        freezeTableName: true //Таблица называется как модель
    });

    return Documents;
};
/*const config = require('../config');
const {Sequelize, Model} = require('sequelize');

module.exports.sync = async (force, alter) => {
    //Подключение к базе
    const sequelize = new Sequelize(config.dbConfig);

    class Documents extends Model {}
    Documents.init({
        Id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
        Name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        TableName: {
            type: Sequelize.STRING, 
            allowNull: false
        },
        Users: {
            type: Sequelize.STRING, 
            allowNull: false
        }
        
    }, {
        sequelize,
        modelName: 'Documents',
        freezeTableName: true //Таблица называется как модель
        // options
    });

   //{force: true} - удалить таблицы и создать их заново, но уже с нужной нам структурой
   let message;
   if (force == true) {
       await sequelize
           .sync({ force: true })
           .then(result => message = 'Синхронизация таблицы документов прошла успешно \n')
           .catch(err => message = 'Синхронизация таблицы документов прошла НЕ успешно \n' + err);
   }
   //{alter: true} - обновить базу, добавить новые таблицы и столбцы
   if (alter == true) {
       await sequelize
           .sync({ alter: true })
           .then(result => message = 'Синхронизация таблицы документов прошла успешно \n')
           .catch(err => message = 'Синхронизация таблицы документов прошла НЕ успешно \n' + err);
   }

    //Закрываем соединение с базой
    sequelize.close();
    return message;
};
*/