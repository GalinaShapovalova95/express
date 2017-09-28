//Created by Galina on 22.08.17.

var express = require('express');
var router = express.Router();

var controller = require('./controller.js');


router.get('/', controller.getAllTodos);
router.post('/', controller.createNewTodo);
router.delete('/checked', controller.deleteAllChecked);
router.delete('/:id', controller.deleteOneTodo);
router.patch('/', controller.updateAllTodos);
router.patch('/:id', controller.updateTodos);

module.exports = router;

