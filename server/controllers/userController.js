const db = require('../models/models');
const path = require('path');
const userController = {};

userController.saveUser = async (req, res, next) => {
  const { username, password } = req.body;
  // console.log(username);
  // console.log(password);

  const sqlQuery = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;';
  const params = [username, password];
  console.log('the db: ', db);
  
  try {
    const response = await db.query(sqlQuery, params);
    console.log(response);
    
    res.locals.response = response.rows[0]._id;
    res.cookie('userID', response.rows[0]._id.toString(), { httpOnly: true });
    return next();
  } 
  catch (error) {
    console.log('error in userController.saveUser');
    return next({
      log: 'Error in userController.saveUser',
      status: 500,
      message: { err: `An error occurred in userController.saveUser ${error}`  },
    });
  }
};

userController.verifyUser = async (req, res, next) => {
  const { username, password } = req.body;

  // set cookie with _id
  const sqlQuery = 'SELECT _id FROM users WHERE username = $1 AND password = $2;'
  const params = [username, password];

  try {
    const response = await db.query(sqlQuery, params);
    if (response.rows.length === 0) {
      return next({
        log: 'Error in userController.verifyUser',
        status: 401,
        message: { err: `An error occurred in userController.verifyUser ${error}`  },
      });
    }
    console.log(response.rows);
    res.locals.response = response.rows[0]._id;

    // to set cookie as a property
    res.cookie('userID', response.rows[0]._id.toString(), { httpOnly: true });
    return next();
  }
  catch (error) {
    return next({
      log: 'Error in userController.verifyUser',
      status: 500,
      message: { err: `An error occurred in userController.verifyUser ${error}`  },
    });
  }
};

module.exports = userController;