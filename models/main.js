module.exports = (sequelize, Sequelize) => {
    const Main = sequelize.define("Main", {
        Name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Table: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Main',
        freezeTableName: true //Таблица называется как модель
    });

    return Main;
};