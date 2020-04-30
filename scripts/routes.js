const controllers = require("../models/controllers.js");

module.exports.get = async (ctx) => {
    console.log('get.query=', ctx.query);
    let type = ctx.query.type; //Тип окна docID
    let docID = ctx.query.docID; //id таблицы Documents
    let id = ctx.query.id; //id таблицы
    let docColumns = ctx.query.docColumns; //{} с полями и их значениями

    let response = await controllers.get({
        type,
        docID,
        id,
        docColumns
    });
    console.log('response.body=', response);
    ctx.response.body = {
        response
    };
};

module.exports.post = async (ctx) => {
    console.log("post_body:", ctx.request.body);
    let type = ctx.request.body.type; //Тип окна docID
    let docID = ctx.request.body.docID; //id таблицы Documents
    let id = ctx.request.body.id; //id таблицы
    let docColumns = ctx.request.body.docColumns; //{} с полями и их значениями
    let response = {};
    switch (type) {
        case 'main':
            response = await controllers.createMain(docColumns);
            break;

        case 'journal':
            switch (docID) {
                case '3': //users
                    response = await controllers.createUser(docColumns);
                    break;

                default:
                    response = await controllers.createJournal(docID);
                    break;
            }
            break;

        case 'doc':
            //if (id)
            response = await controllers.updateDoc(docID, id, docColumns);
            // else
            //    response = await controllers.createDoc(docID, docColumns);
            break;
        case 'docColumns':
            response = await controllers.createColumn(docID, docColumns);
            break;
        default:
            response.error = 'Error, dont find type';
            break;
    };
    ctx.response.body = {
        response
    };
};

module.exports.delete = async (ctx) => {
    console.log("delete.body:", ctx.request.body);
    let type = ctx.request.body.type; //Тип окна docID
    let docID = ctx.request.body.docID; //id таблицы Documents
    let id = ctx.request.body.id; //id таблицы
    let docColumns = ctx.request.body.docColumns; //{} с полями и их значениями
    let response = {};
    switch (type) {
        case 'main':
            response = await controllers.deleteMain(docID);
            break;

        case 'journal':
            response = await controllers.deleteJournal(docID, id);
            break;

            //case 'doc':
            //     response = await controllers.deleteDoc(docID, docColumns);
            //    break;

        case 'docColumns':
            response = await controllers.deleteDocColumn(docID, id);
            break;

        default:
            response.error = 'Error, dont find type';
            break;
    };
    ctx.response.body = {
        response
    };
};
/*
module.exports.get_testDbConnection = async (ctx) => {
    let response = await controllers.testDbConnection();
    ctx.response.body = {
        response
    };
    //ctx.body = message;
    //console.log( ctx.response);
};
*/
module.exports.post_createDB = async (ctx) => {
    let force = false;
    let alter = false;
    //{force: true} - удалить таблицы и создать их заново, но уже с нужной нам структурой
    //{alter: true} - обновить базу, добавить новые таблицы и столбцы 
    if (ctx.request.body.force) force = ctx.request.body.force;
    if (ctx.request.body.alter) alter = ctx.request.body.alter;
    let response = await controllers.createDB(force, alter);
    //console.log("message:",message);
    ctx.response.body = {
        response
    };
};

/*
module.exports.get_users = async (ctx) => {
    let data = await controllers.findAll({
        model: "users"
    });
    ctx.response.body = {
        answer: data
    };
};

const validate = require("./validate.js");
module.exports.post_users = async (ctx) => {
    let window;
    let Login = '';
    let Password = '';
    if (ctx.request.body.window) window = ctx.request.body.window;
    if (ctx.request.body.Obj) Obj = ctx.request.body.Obj;
    //let message = await controllers.createDB({window, name});  
    console.log("body:", ctx.request.body);
    let data = await controllers.create({
        window,
        Login: Obj.Login,
        Password: Obj.Password
    });
    ctx.response.body = {
        answer: data
    };
};


module.exports.delete_users = async (ctx) => {
    let window;
    let id;
    if (ctx.request.body.window) window = ctx.request.body.window;
    if (ctx.request.body.id) id = ctx.request.body.id;
    console.log("window:", window);
    let data = await controllers.destroy({
        window,
        id
    });
    ctx.response.body = {
        answer: data
    };
};

*/
module.exports.get_api = (ctx) => {
    let message = "Ассистент - удобный доступ к Вашим данным \n";
    message = message + "Сервер Ассистент запущен";
    ctx.body = message;
};
