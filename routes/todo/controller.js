//Created by Galina on 25.08.17.

var todoModel = require('../../db/models/todos.model.js');

function getAllTodos(req, res) {
  todoModel.find({})
    .then(function(todos) {
      res.status(200).send(todos);
    })
    .catch((err) => {
      console.log(err);
    });
}

function createNewTodo(req, res) {
  todoModel.create({text: req.body.text, state: "false"})
    .then((todo) => {
      res.status(200).send(todo);
    })
    .catch((err) => {
      console.log(err);
    });
}

function deleteAllChecked(req, res) {     //delete all checked
  todoModel.find({state: true}).remove().exec()
    .then((todos) => {
      res.status(200).send(todos);
    })
    .catch((err) => {
      console.log(err)
    });
}

function deleteOneTodo(req, res) {
  todoModel.findByIdAndRemove({'_id': req.params.id})
    .then((todos) => {
      res.status(200).send(todos);
    })
    .catch((err) => {
      console.log(err)
    });
}

function updateAllTodos(req, res) {
  todoModel.update({}, {state: req.body.checked}, {multi: true})
    .then((todos) => {
      res.status(200).send(todos);
    })
    .catch((err) => {
      console.log(err)
    });
}

function updateTodos(req, res) {       // update check and after double click
  if (req.body.checked){
    todoModel.findByIdAndUpdate({'_id': req.params.id}, {'state': req.body.checked} )
      .then((todo) => {
        res.status(200).send(todo);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  else if (req.body.text){
    console.log(req.body);
    todoModel.findByIdAndUpdate({'_id': req.params.id}, {'text': req.body.text} )
      .then((todo) => {
        res.status(200).send(todo);
      })
      .catch((err) => {
        console.log(err);
      })
  }
}

module.exports = {
  getAllTodos: getAllTodos,
  createNewTodo: createNewTodo,
  deleteAllChecked: deleteAllChecked,
  deleteOneTodo: deleteOneTodo,
  updateAllTodos: updateAllTodos,
  updateTodos: updateTodos
};