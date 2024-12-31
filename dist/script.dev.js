"use strict";

var taskForm = document.getElementById("task-form");
var confirmCloseDialog = document.getElementById("confirm-close-dialog");
var openTaskFormBtn = document.getElementById("open-task-form-btn");
var closeTaskFormBtn = document.getElementById("close-task-form-btn");
var addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
var cancelBtn = document.getElementById("cancel-btn");
var discardBtn = document.getElementById("discard-btn");
var tasksContainer = document.getElementById("tasks-container");
var titleInput = document.getElementById("title-input");
var dateInput = document.getElementById("date-input");
var descriptionInput = document.getElementById("description-input");
var taskData = JSON.parse(localStorage.getItem("data")) || [];
var currentTask = {};

var removeSpecialChars = function removeSpecialChars(val) {
  return val.trim().replace(/[^A-Za-z0-9\-\s]/g, "");
};

var addOrUpdateTask = function addOrUpdateTask() {
  if (!titleInput.value.trim()) {
    alert("Please provide a title");
    return;
  }

  var dataArrIndex = taskData.findIndex(function (item) {
    return item.id === currentTask.id;
  });
  var taskObj = {
    id: "".concat(removeSpecialChars(titleInput.value).toLowerCase().split(" ").join("-"), "-").concat(Date.now()),
    title: removeSpecialChars(titleInput.value),
    date: dateInput.value,
    description: removeSpecialChars(descriptionInput.value) //descriptionInput.value,

  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
};

var updateTaskContainer = function updateTaskContainer() {
  tasksContainer.innerHTML = "";
  taskData.forEach(function (_ref) {
    var id = _ref.id,
        title = _ref.title,
        date = _ref.date,
        description = _ref.description;
    tasksContainer.innerHTML += "\n        <div class=\"task\" id=\"".concat(id, "\">\n          <p><strong>Title:</strong> ").concat(title, "</p>\n          <p><strong>Date:</strong> ").concat(date, "</p>\n          <p><strong>Description:</strong> ").concat(description, "</p>\n          <button onclick=\"editTask(this)\" type=\"button\" class=\"btn\">Edit</button>\n          <button onclick=\"deleteTask(this)\" type=\"button\" class=\"btn\">Delete</button> \n        </div>\n      ");
  });
};

var deleteTask = function deleteTask(buttonEl) {
  var dataArrIndex = taskData.findIndex(function (item) {
    return item.id === buttonEl.parentElement.id;
  });
  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
};

var editTask = function editTask(buttonEl) {
  var dataArrIndex = taskData.findIndex(function (item) {
    return item.id === buttonEl.parentElement.id;
  });
  currentTask = taskData[dataArrIndex];
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;
  addOrUpdateTaskBtn.innerText = "Update Task";
  taskForm.classList.toggle("hidden");
};

var reset = function reset() {
  addOrUpdateTaskBtn.innerText = "Add Task";
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
};

if (taskData.length) {
  updateTaskContainer();
}

openTaskFormBtn.addEventListener("click", function () {
  return taskForm.classList.toggle("hidden");
});
closeTaskFormBtn.addEventListener("click", function () {
  var formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  var formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});
cancelBtn.addEventListener("click", function () {
  return confirmCloseDialog.close();
});
discardBtn.addEventListener("click", function () {
  confirmCloseDialog.close();
  reset();
});
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addOrUpdateTask();
});