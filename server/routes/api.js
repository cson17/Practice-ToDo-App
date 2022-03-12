const express = require('express');
const toDoController = require('../controllers/toDoController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', toDoController.getToDos, (req, res) => {
    return res.status(200).json(res.locals.toDos);
});

router.post('/', toDoController.addToDo, (req, res) => {
    return res.status(200).json(res.locals.newToDo);
});

router.patch('/', toDoController.updateToDo, (req, res) => {
    return res.status(200).json(res.locals.updatedToDo);
});

// router.delete('/', toDoController.deleteToDo, (req, res) => {
//     return res.status(200).json(res.locals.sucessMessage);
// });

router.post('/user', userController.saveUser, (req, res) => {
    return res.status(200).json(res.locals.response)
});

router.post('/verifyUser', userController.verifyUser, (req, res) => {
    return res.status(200).json(res.locals.response)
});
  
module.exports = router;