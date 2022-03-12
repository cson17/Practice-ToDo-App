const db = require('../models/models');
// const cookieParser = require('cookie-parser');
const toDoController = {};

toDoController.getToDos = async (req, res, next) => {
  const sqlQuery = 'SELECT * FROM toDos WHERE user_id = $1;'
  const params = [req.cookies.userID];
  // const params = [1];

  try {
    const response = await db.query(sqlQuery, params);
    console.log(response);
    res.locals.toDos = response.rows;
    return next();
  }
  catch (error) {
    console.log('error in toDoController.getToDos');
    return next({
      log: 'Error in toDoController.getToDos',
      status: 500,
      message: { err: `An error occurred in toDoController.getToDos ${error}`  },
    });
  }
};

toDoController.addToDo = async (req, res, next) => {
  console.log(req.cookies);
  const { content } = req.body;

  // content & user_id are columns in db
  const sqlQuery = 'INSERT INTO toDos (content, user_id) VALUES ($1, $2) RETURNING *;'
  const params = [content, req.cookies.userID];

  try {
    const response = await db.query(sqlQuery, params);
    console.log(response);
    
    // res.locals.newToDo = response.rows[0]['content'];
    res.locals.newToDo = response.rows[0];
    return next();
  } 
  catch (error) {
    console.log('error in toDoController.addToDo');
    return next({
      log: 'Error in toDoController.addToDo',
      status: 500,
      message: { err: `An error occurred in toDoController.addToDo ${error}`  },
    });
  }
};

toDoController.updateToDo = async (req, res, next) => {
  const { content, id } = req.body;
  const sqlQuery = 'UPDATE toDos SET content = $1 WHERE _id = $2 RETURNING *;'
  const params = [content, id];
  try {
    const response = await db.query(sqlQuery, params); 
    console.log(response);

    res.locals.updatedToDo = response.rows[0];
    return next();
  }
  catch (error) {
    console.log('error in toDoController.updateToDo');
    return next({
      log: 'Error in toDoController.updateToDo',
      status: 500,
      message: { err: `An error occurred in toDoController.updateToDo ${error}`  },
    });
  }
}

module.exports = toDoController;