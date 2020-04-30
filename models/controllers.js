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
  let Response = {};
  let Rows = [];

  if (!type) return Response.Error = 'Error, dont find type';
  if (type != 'main') {
    let Obj = await Documents.findByPk(docID);
    if (!(Obj || {}).Name) return Response.Error = 'Error, dont find docID';
  }
  switch (type) {
    case 'main':
      //await Documents.findAll().map(row => Rows[row.id] = row.Name);
      await Documents.findAll().map((row,id) => {Rows[id] = {Id: row.id, Name: row.Name}});
      //Rows = await Documents.findAll();
      break;

    case 'journal':
      switch (docID) {
        case '1':
          Response = await db.testDbConnection();
          break;
        case '3':
          //await Users.findAll().map(row => Rows[row.id] = row.ФИО);
		  await Users.findAll().map((row,id) => {Rows[id] = {Id: row.id, Date: toDate(row.createdAt), Description: row.ФИО}});
          break;
        default:
          Rows = await db.getJournal(docID);
      };
      break;

    case 'doc':
      //Rows = await db.getDoc(docID, id);
      //Response.ColumnsTypes = await db.getDocColumnsTypes(docID);
	    Rows = await db._getDoc(docID, id);
      break;

    case 'docColumns':
      Rows = await db.getDocColumns(docID);
      break;

    default:
      Response.Error = 'Error, dont find doc type';
      break;
  };

  Response.Rows = Rows;
  //Название документа
  let Model = await Documents.findByPk(docID);
  Response.Title = (Model || {}).Name ? Model.Name : "Ассистент - Главная";

  //console.log('Response=', Response);

  return Response;

  //let Obj = await Documents.findByPk(docID);
  //Model = await db.getDocModel({
  //  Obj
  //});

  //const Title = req.query.Title;
  // var condition = Title ? { Title: { [Op.like]: `%${Title}%` } } : null;
  /*
  let condition = id ? {
    id: id
  } : null;
  if (!Model) return 'Error, dont find model';

  let Rows = await Model.findAll({
    where: condition
  }); 
  */
};

module.exports.createMain = async (docColumns) => {
  //let Response;
  //if (!docColumns) return Response.Error = 'Error, dont find docColumns';
  //Добавляем новый документ в таблицу Documents
  await Documents.create({
    Name: docColumns.Name,
    Table: docColumns.Name,
    Users: ',admin,'
  });
  //Создаём новую таблицу
  let Response = await db.createTable(docColumns);
  return JSON.stringify(Response);
};

module.exports.createJournal = async (docID) => {
  let Response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return Response.Error = 'Error, dont find docID';
  Response = await db.addDoc(docID);
  return JSON.stringify(Response);
};

module.exports.createUser = async (docColumns) => {
  let Response = await Users.create({
    Логин: docColumns.Login,
    Пароль: docColumns.Password,
    ФИО: docColumns.Login
  });
  return JSON.stringify(Response);
};
/*
module.exports.createDoc = async (docID, docColumns) => {
  let Response;
  if (!docID) return Response.Error = 'Error, dont find docID';
  if (!docColumns) return Response.Error = 'Error, dont find docColumns';
  Response = await db.addDocColumn(docID, docColumns);
  return JSON.stringify(Response);
};
*/
module.exports.updateDoc = async (docID, id, docColumns) => {
  let Response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return Response.Error = 'Error, dont find docID';
  Response = await db.updateDocColumns(docID, id, docColumns);
  return JSON.stringify(Response);
};

module.exports.createColumn = async (docID, docColumns) => {
  let Response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return Response.Error = 'Error, dont find docID';
  Response = db.addDocColumn(docID, docColumns);
  return JSON.stringify(Response);
};

module.exports.deleteMain = async (docID) => {
  let Response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return Response.Error = 'Error, dont find docID';
  await DocColumns.destroy({
    where: {
      TableId: docID
    }
  });
  Response = await Documents.destroy({
    where: {
      id: docID
    }
  });

  return JSON.stringify(Response);
};

module.exports.deleteJournal = async (docID, id) => {
  let Response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return Response.Error = 'Error, dont find docID';
  Response = await db.deleteDocById(docID, id);
  return JSON.stringify(Response);
};
/*
module.exports.deleteDoc = async (docID, docColumns) => {
  let Response;
  Response = await db.deleteDocColumn(docID, docColumns);
  return JSON.stringify(Response);
};
*/
module.exports.deleteDocColumn = async (docID, id) => {
  let Response = {};
  let Obj = await Documents.findByPk(docID);
  if (!Obj.Name) return Response.Error = 'Error, dont find docID';
  Response = await db.deleteDocColumn(docID, id);
  return JSON.stringify(Response);
};
/*
module.exports.create = async ({
  docID,
  Obj
}) => {
  let Response;
  let Model;
  if (docID == '3') { //users    
    
  } else if (docID == 'main') {

  } else if (docID == 'docColumn') {
    
  } else {
   
  }

  return JSON.stringify(Response);
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
  if (!Model) return "Error, dont find model";
  //Удаляем из таблицы Model
  let Response = await Model.destroy({
    where: {
      id: arrID
    }
  });
  return JSON.stringify(Response);
}

module.exports.update = async ({
  docID,
  Obj
}) => {
  let Response;
  if (docID == '3') { //users    
    let row = await Users.findByPk(docID);
    row.Логин = Obj.Логин;
    row.Пароль = Obj.Пароль;
    row.ФИО = Obj.ФИО;
    Response = await row.save();
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

  return JSON.stringify(Response);
};
*/
module.exports.createDB = async (force, alter) => {
  return await db.createDB(force, alter);
};