/**
 * Created by user on 24.08.17.
 */
var mongoose = require('../index.js');

var todoSchema = mongoose.Schema({
  text:    String,
  state:   Boolean
});
var todoModel = mongoose.model('todoModel', todoSchema);

module.exports = todoModel;
