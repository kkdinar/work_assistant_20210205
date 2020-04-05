module.exports = (sequelize, Sequelize) => {
    const Dictionarys = sequelize.define("Dictionarys", {
        Users: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Value: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Type: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Dictionarys',
        freezeTableName: true //Таблица называется как модель
    });

    return Dictionarys;
};
/*const config = require('../config');
const {Sequelize, Model} = require('sequelize');

module.exports.sync = async (force, alter) => {
    //Подключение к базе
    const sequelize = new Sequelize(config.dbConfig);

    class Dictionarys extends Model {}
    Dictionarys.init({
        Id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
        Users: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Value: {
            type: Sequelize.STRING, 
            allowNull: false
        },
        Type: {
            type: Sequelize.STRING, 
            allowNull: false
        }
        
    }, {
        sequelize,
        modelName: 'Dictionarys',
        freezeTableName: true //Таблица называется как модель
        // options
    });

    //{force: true} - удалить таблицы и создать их заново, но уже с нужной нам структурой
    let message;
    if (force == true) {
        await sequelize
            .sync({ force: true })
            .then(result => message = 'Синхронизация таблицы справочников прошла успешно \n')
            .catch(err => message = 'Синхронизация таблицы справочников прошла НЕ успешно \n' + err);
    }
    //{alter: true} - обновить базу, добавить новые таблицы и столбцы
    if (alter == true) {
        await sequelize
            .sync({ alter: true })
            .then(result => message = 'Синхронизация таблицы справочников прошла успешно \n')
            .catch(err => message = 'Синхронизация таблицы справочников прошла НЕ успешно \n' + err);
    }

    //Закрываем соединение с базой
    sequelize.close();
    return message;
};
*/