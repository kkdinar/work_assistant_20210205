const Koa = require('koa');
const app = new Koa();

const Router = require('@koa/router');
const router = new Router({
    prefix: '/api'
});

const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

const config = require('./config.js');
const routes = require('./scripts/routes.js');

//router.get("/", routes.get_api);

//router.get("/get", routes.get);
router.get("/", routes.get);

//router.post("/post", routes.post);
router.post("/", routes.post);

//router.delete("/delete", routes.delete);
router.delete("/", routes.delete);

//router.put("/put", routes.put);

//Проверка подключения к базе 
//router.get("/testDbConnection", routes.get_testDbConnection);
//Создание базы
router.post("/createDB", routes.post_createDB);

//Получить данные о users
//router.get("/users", routes.get_users);
//Создать нового users
//router.post("/users", routes.post_users);
//Удалить users по id
//router.delete("/users/:id", routes.delete_users);

app.use(router.routes())
app.listen(config.main_port);


/*





router.post("/createDB", async (ctx) => {
    let message; // = JSON.stringify(ctx.request.body);
    let force = false;
    let alter = false;
    //{force: true} - удалить таблицы и создать их заново, но уже с нужной нам структурой
    //{alter: true} - обновить базу, добавить новые таблицы и столбцы
    if (ctx.request.body.force) force = true;
    if (ctx.request.body.alter) alter = true;

    await createDB.createDB(force, alter)
        .then((mes) => message = mes);
    //console.log(ctx.request.body);
    //ctx.response.send(`${request.body}`);
    ctx.body = message;
});


*/
/*
router.get('/', async (ctx, next) => {
    //Проверка подключения к базе  
    let message;
    await testdb.testDbConnection()
        .then((mes) => message = mes);
 //   await users.syncSqlite3()
  //      .then((mes) => message = message + mes);

    ctx.body = message;
  });
/*


//Вывод на экран сообщения
app.use(async ctx => {

    //Проверка подключения к базе sqlite3 
    let message;
    await testdb.testDbConnection()
        .then((mes) => message = mes);
 //   await users.syncSqlite3()
  //      .then((mes) => message = message + mes);

    ctx.body = message;
});
*/