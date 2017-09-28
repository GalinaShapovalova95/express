/**
 * Created by user on 24.08.17.
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo');

module.exports = mongoose;
