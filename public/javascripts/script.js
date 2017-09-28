//Created by Galina Shapovalova on 14.08.17.
'use strict';

var list = [];
var mode = 'all';
var page = 1;

var $list = $('#list');
var $test = $('#TEST');
var $task = $('#task');
var $add = $('#add');
var $checkbox = $('#checkbox');
var $done_count = $('#done-count');
var $not_done_count = $('#not-done-count');
var $del_all = $('#del-all');
var $all = $('#all');
var $done = $('#done');
var $undone = $('#undone');

function print(showLast) {       //Print lists

  $list.html("");

  if (mode == 'all') {
    $all.addClass('active-mode');
    $done.removeClass('active-mode');
    $undone.removeClass('active-mode');
  }
  else if (mode == 'done') {
    $done.addClass('active-mode');
    $all.removeClass('active-mode');
    $undone.removeClass('active-mode');
  }
  else if (mode == 'undone') {
    $undone.addClass('active-mode');
    $all.removeClass('active-mode');
    $done.removeClass('active-mode');
  }

  var filteredList = list.filter(function (item) {  // list[item] - element list
    if (mode == 'all')  return item;
    if (mode == 'done') return item.checked == true;
    if (mode == 'undone') return item.checked == false;
  });

  var amountTasks = filteredList.length;
  var amountPages = Math.ceil(amountTasks / 5);

  if (showLast) page = amountPages;

  var stringTask = '';
  var stringPage = '';
  if (amountPages < page) {
    page = amountPages
  }

  for (var i = page * 5 - 5; i < page * 5; i++) {// рисуем задачи

    if (filteredList[i] === undefined) continue;

    else if (filteredList[i].text.trim() !== '') {
      stringTask += `<li id="item${filteredList[i].id}" class="list__item ${filteredList[i].checked ? ' checked ' : ''}">
                        <input type="checkbox" id="checkbox${filteredList[i].id}" class="checkbox"/>
                        <input type="text" readonly id="text${filteredList[i].id}" value="${filteredList[i].text}" class="text"/>
                       <button id="del${filteredList[i].id}" class="del">X</button></li>`;
    }
  }
  $list.append(stringTask);

  $('#pages').empty();
  for (var i = 0; i < amountPages; i++) {                          // рисуем страницы
    stringPage += `<li id="pages${i}" class="page-item">
                         <a id="${i}" class="page-link">${i + 1}</a></li>`;
  }
  $('#pages').append(stringPage);

  $(`.page-item:nth-child(${page})`).addClass('active');

  processEvents();
}


function addNewTask() {   // Create a new list item
  var input = $task;
  var newTask = input.val();
  var newTaskNull = newTask.trim().length;
  console.log('newTaskNull' + newTaskNull);

  if (!newTask) return;

  // var lastElementId = (list.length == 0) ? 0 : list[list.length - 1].id + 1;
  if (newTaskNull !== 0) {

    $.ajax({
      url: '/todos',
      method: 'POST',
      data: {text: newTask},
      success: function (data) {
        console.log(data._id);

        list.push({id: data._id, text: newTask, checked: false});

        print(true);
        changePage();
        input.val('');
        count();
      }
    });
  }
}


function processEvents() {
  var selectedId = 0;
  $('.del').click(function (event) {                       //list.id delete
    for (let i = 0; i < list.length; i++) {
      if ('del' + list[i].id === event.target.id){
        selectedId = event.target.id;
        $.ajax({
          url: '/todos/' + list[i].id,
          method: 'DELETE',
          data: {id: selectedId},
          success: function () {
            list.splice(i, 1);
            changePage();
            count();
          }
        });
      }
    }
  });


  $('.checkbox').click(function (event) {          //list.checked
    for (let i = 0; i < list.length; i++) {
      if ('checkbox' + list[i].id !== event.target.id) {
        continue;
      }

      $.ajax({
        url: '/todos/' + list[i].id,
        method: 'PATCH',
        data: {checked: !list[i].checked},
        success: function (data) {
          console.log(i);
          list[i].checked= !list[i].checked;
          changePage();
          count();
        }
      });
    }
  });

  $('.text').dblclick(function (event) {               //edit
    for (var i = 0; i < list.length; i++) {
      if ('text' + list[i].id === event.target.id) {
        $(`#${event.target.id}`).removeAttr('readonly');
      }

    }
  });

  $('.text').blur(function (event) {                //blur
    for (let i = list.length - 1; i >= 0; i--) {

      var value = $(`#${event.target.id}`).val();

      if ('text' + list[i].id === event.target.id && value.trim() !== '') {

        $.ajax({
          url: '/todos/' + list[i].id,
          method: 'PATCH',
          data: {text: value},
          success: function (data) {
            list[i].text = value.trim();
          }
        });
      }
      else if ('text' + list[i].id === event.target.id && value.trim() === '') {
        $.ajax({
          url: '/todos/' + list[i].id,
          method: 'DELETE',
          data: {id: selectedId},
          success: function () {
            list.splice(i, 1);
            changePage();
            count();
          }
        });
      }
    }
  });

  $('.page-link').click(changePage);
}


function deleteAllChecked() {
  $.ajax({
    url: '/todos/checked',
    method: 'DELETE',
    success: function () {
      for (var i = list.length - 1; i >= 0; i--) {
        if (list[i].checked) {

          list.splice(i, 1);
        }
      }
      changePage();
      count();
    }
  });
}

function checkAll() {
  var  checkboxValue = $checkbox.prop('checked'); //checked or unchecked
    $.ajax({
      url: '/todos',
      method: 'PATCH',
      data: {checked: checkboxValue},
      success: function (data) {
        for (let i = 0; i < list.length; i++) {
          list[i].checked = checkboxValue;
          print(true);
          count();
          changePage();
        }
      }
    });
}

function count() {
  $done_count.empty();
  $not_done_count.empty();
  var listDone = list.filter(function (i) {
    return i.checked === true;
  }).length;
  var listNotDone = list.length - listDone;
  $done_count.append('Done: ' + listDone);
  $not_done_count.append('Not Done: ' + listNotDone);
}

function changeMode(e) {
  mode = e.target.id;
  print(true);
  changePage();
}

function changePage(e) {
  if (e) {
    page = parseInt(e.target.id) + 1;
  }
  print();
}


$(document).ready(function () {
  $.ajax({
    url: '/todos',
    method: 'GET',
    success: function (todos) {
      todos.forEach(function (item) {   //todos[item]
        list.push({
          text: item.text,
          checked: item.state,
          id: item._id
        });
      });
      print();
      count();
    }
  });

  $del_all.click(deleteAllChecked);

  $checkbox.click(checkAll);

  $all.click(changeMode);
  $done.click(changeMode);
  $undone.click(changeMode);

  $test.on('submit',function (event) {   // Add on Enter
    event.preventDefault();
    addNewTask();
  });

  $('.page-link').click(changePage);

  count();
});