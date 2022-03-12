const path = require('path');
const express = require('express');
const toDoController = require('./controllers/toDoController.js');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routes/api');
// const { Pool } = require('pg');

const app = express();

const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//may not need for grad assessment
app.use(express.static(path.resolve(__dirname, '../client')));

//any requests that are sent to /api will use the apiRouter
app.use('/api', apiRouter);

//serve up the index.html file
app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

//catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));

//global-error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log); 
  return res.status(errorObj.status).json(errorObj.message);
});

//make sure PORT variable is what you expect
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

// We export an object that contains a property called query,
// which is a function that returns the invocation of pool.query() after logging the query
// This will be required in the controllers to be the access point to the database
// module.exports = {
//     app,
//     query: (text, params, callback) => {
//         console.log('executed query', text);
//         return pool.query(text, params, callback);
//     }
// };

module.exports =  app;


  