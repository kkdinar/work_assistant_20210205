module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("Users", {
        Логин: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        Пароль: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ФИО: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Users',
        freezeTableName: true //Таблица называется как модель
    });

    return Users;
};
/*
const config = require('../config');
const {
    Sequelize,
    Model
} = require('sequelize');
const sequelize = new Sequelize(config.dbConfig);


module.exports.sync = async (force, alter) => {
    //Подключение к базе
    const sequelize = new Sequelize(config.dbConfig);

    // const Model = Sequelize.Model;
    class Users extends Model {}
    Users.init({
        Id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        Login: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        Password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Phone: {
            type: Sequelize.STRING
            // allowNull defaults to true
        },
        Email: {
            type: Sequelize.STRING
            // allowNull defaults to true
        }
    }, {
        sequelize,
        modelName: 'Users',
        freezeTableName: true //Таблица называется как модель
        // options
    });

    //{force: true} - удалить таблицы и создать их заново, но уже с нужной нам структурой
    let message;
    if (force == true) {
        await sequelize
            .sync({ force: true })
            .then(result => message = 'Синхронизация таблицы пользователей прошла успешно \n')
            .catch(err => message = 'Синхронизация таблицы пользователей прошла НЕ успешно \n' + err);
    }
    //{alter: true} - обновить базу, добавить новые таблицы и столбцы
    if (alter == true) {
        await sequelize
            .sync({ alter: true })
            .then(result => message = 'Синхронизация таблицы пользователей прошла успешно \n')
            .catch(err => message = 'Синхронизация таблицы пользователей прошла НЕ успешно \n' + err);
    }
    
    //Закрываем соединение с базой
    sequelize.close();
    return message;
};
*/