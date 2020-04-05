const db = require("../models/db.js");
const Documents = db.Documents;
const Users = db.Users;
const DocColumns = db.DocColumns;
const Op = db.Sequelize.Op;
const config = require('../config.js');
const Sequelize = require('sequelize');

module.exports.get = async ({
  type,
  docID = '',
  id = '',
  docColumns = {}
}) => {
  let response = {};
  let rows = {};

  if (!type) return response.error = 'Error, dont find type';
  if (type != 'main') {
    let Obj = await Documents.findByPk(docID);
    if (!(Obj || {}).Name) return response.error = 'Error, dont find docID';
  }
  switch (type) {
    case 'main':
      await Documents.findAll().map(row => rows[row.id] = row.Name);
      break;

    case 'journal':
      switch (docID) {
        case '1':
          response = await db.testDbConnection();
          break;
        case '3':
          await Users.findAll().map(row => rows[row.id] = row.ФИО);
          break;
        default:
          rows = await db.getJournal(docID);
      };
      break;

    case 'doc':
      rows = await db.getDoc(docID, id);
      response.columnsTypes = await db.getDocColumnsTypes(docID);
      break;

    case 'docColumns':
      rows = await db.getDocColumns(docID);
      break;

    default:
      response.error = 'Error, dont find doc type';
      break;
  };

  response.rows = rows;
  //Название документа
  let Model = await Documents.findByPk(docID);
  response.title = (Model || {}).Name ? Model.Name : "Ассистент - Главная";

  //console.log('response=', response);

  return response;

  //let Obj = await Documents.findByPk(docID);
  //Model = await db.getDocModel({
  //  Obj
  //});

  //const title = req.query.title;
  // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  /*
  let condition = id ? {
    id: id
  } : null;
  if (!Model) return 'Error, dont find model';

  let rows = await Model.findAll({
    where: condition
  }); 
  */
};

module.exports.createMain = async (docColumns) => {
  //let response;
  //if (!docColumns) return response.error = 'Error, dont find docColumns';
  //Добавляем новый документ в таблицу Documents
  await Documents.create({
    Name: docColumns.Name,
    Table: docColumns.Name,
    Users: ',admin,'
  });
  //Создаём новую таблицу
  let response = await db.createTable(docColumns);
  return JSON.stringify(response);
};

module.exports.createJournal = async (docID) => {
  let response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return response.error = 'Error, dont find docID';
  response = await db.addDoc(docID);
  return JSON.stringify(response);
};

module.exports.createUser = async (docColumns) => {
  let response = await Users.create({
    Логин: docColumns.Login,
    Пароль: docColumns.Password,
    ФИО: docColumns.Login
  });
  return JSON.stringify(response);
};
/*
module.exports.createDoc = async (docID, docColumns) => {
  let response;
  if (!docID) return response.error = 'Error, dont find docID';
  if (!docColumns) return response.error = 'Error, dont find docColumns';
  response = await db.addDocColumn(docID, docColumns);
  return JSON.stringify(response);
};
*/
module.exports.updateDoc = async (docID, id, docColumns) => {
  let response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return response.error = 'Error, dont find docID';
  response = await db.updateDocColumns(docID, id, docColumns);
  return JSON.stringify(response);
};

module.exports.createColumn = async (docID, docColumns) => {
  let response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return response.error = 'Error, dont find docID';
  response = db.addDocColumn(docID, docColumns);
  return JSON.stringify(response);
};

module.exports.deleteMain = async (docID) => {
  let response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return response.error = 'Error, dont find docID';
  await DocColumns.destroy({
    where: {
      TableId: docID
    }
  });
  response = await Documents.destroy({
    where: {
      id: docID
    }
  });

  return JSON.stringify(response);
};

module.exports.deleteJournal = async (docID, id) => {
  let response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return response.error = 'Error, dont find docID';
  response = await db.deleteDocById(docID, id);
  return JSON.stringify(response);
};
/*
module.exports.deleteDoc = async (docID, docColumns) => {
  let response;
  response = await db.deleteDocColumn(docID, docColumns);
  return JSON.stringify(response);
};
*/
module.exports.deleteDocColumn = async (docID, id) => {
  let response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return response.error = 'Error, dont find docID';
  response = await db.deleteDocColumn(docID, id);
  return JSON.stringify(response);
};
/*
module.exports.create = async ({
  docID,
  Obj
}) => {
  let response;
  let Model;
  if (docID == '3') { //users    
    
  } else if (docID == 'main') {

  } else if (docID == 'docColumn') {
    
  } else {
   
  }

  return JSON.stringify(response);
};

module.exports.destroy = async ({
  docID,
  arrID
}) => {
  let Model;
  if (docID == '3') Model = Users;
  else if (docID == 'main') {
    Model = Documents;
    
        let tableName = await Model.findAll({
          where: {
            id: arrID[0]
          }
        });
        console.log('destroyTableName=', tableName[0].Name);
        let Obj = {};
        //Удаляем только первый id из списка
        Obj.Name = tableName[0].Name;
        //Удаляем таблицу физически из базы
        await db.destroyDocType({
          Obj
        });
        
  } else {
    let findObj = await Documents.findByPk(docID);
    Model = await db.getDocModel({
      Obj: findObj
    });
  }
  if (!Model) return "error, dont find model";
  //Удаляем из таблицы Model
  let response = await Model.destroy({
    where: {
      id: arrID
    }
  });
  return JSON.stringify(response);
}

module.exports.update = async ({
  docID,
  Obj
}) => {
  let response;
  if (docID == '3') { //users    
    let row = await Users.findByPk(docID);
    row.Логин = Obj.Логин;
    row.Пароль = Obj.Пароль;
    row.ФИО = Obj.ФИО;
    response = await row.save();
  } else {
    let findObj = await Documents.findByPk(docID);
    let Model = await db.getDocModel({
      Obj: findObj
    });
    console.log('Model=', Model);

    //for (let key of Object.keys(Obj)){
    //  
    //  if(key== 'Логин') console.log('Model[key]=',Model[key]); //Model[key]
    //}

  }

  return JSON.stringify(response);
};
*/
module.exports.createDB = async (force, alter) => {
  return await db.createDB(force, alter);
};