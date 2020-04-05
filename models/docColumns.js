module.exports = (sequelize, Sequelize) => {
    const DocColumns = sequelize.define("DocColumns", {
        TableId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Documents', // Внешний ключ на таблицу
                key: 'Id', // на поле
            }
        },
        Name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ColumnName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        DictionaryId: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'DocColumns',
        freezeTableName: true //Таблица называется как модель
    });

    return DocColumns;
};
/*const config = require('../config');
const {Sequelize, Model} = require('sequelize');

module.exports.sync = async (force, alter) => {
    //Подключение к базе
    const sequelize = new Sequelize(config.dbConfig);

    class DocColumns extends Model {}
    DocColumns.init({
        Id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
        TableId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Documents', // Внешний ключ на таблицу
                key: 'Id', // на поле
            }
        },
        Name: {
            type: Sequelize.STRING, 
            allowNull: false
        },
        ColumnName: {
            type: Sequelize.STRING, 
            allowNull: false
        },
        Type: {
            type: Sequelize.STRING, 
            allowNull: false
        },
        DictionaryId: {
            type: Sequelize.STRING, 
            allowNull: false
        }
        
        
    }, {
        sequelize,
        modelName: 'DocColumns',
        freezeTableName: true //Таблица называется как модель
        // options
    });

    //{force: true} - удалить таблицы и создать их заново, но уже с нужной нам структурой
   let message;
   if (force == true) {
       await sequelize
           .sync({ force: true })
           .then(result => message = 'Синхронизация таблицы со столбцами документов прошла успешно \n')
           .catch(err => message = 'Синхронизация таблицы со столбцами документов прошла НЕ успешно \n' + err);
   }
   //{alter: true} - обновить базу, добавить новые таблицы и столбцы
   if (alter == true) {
       await sequelize
           .sync({ alter: true })
           .then(result => message = 'Синхронизация таблицы со столбцами документов прошла успешно \n')
           .catch(err => message = 'Синхронизация таблицы со столбцами документов прошла НЕ успешно \n' + err);
   }

    //Закрываем соединение с базой
    sequelize.close();
    return message;
};
*/