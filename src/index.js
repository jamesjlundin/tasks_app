import './style.css';
const appStorage = (() => {
  const listArray = [];
  const taskArray = [];
  const addNewList = (newList) => listArray.push(newList);
  const addNewTask = (newItem) => taskArray.push(newItem);
  const addListsFromLocalStorage = (LocalListArray) => {
    LocalListArray.forEach( function(list) {
      addNewList(list);
    });
  };
  const addTasksFromLocalStorage = (LocalTasksArray) => {
    LocalTasksArray.forEach( function (task) {
      addNewTask(task);
    });
  };
  const clearAllLists = () => {
    listArray.length = 0;
    taskArray.length = 0;
    localStorage.removeItem("Lists");
    localStorage.removeItem("Tasks");
  };
  const getTheLists = () => {
    return listArray;
  };
  const getTheTasks = () => {
    return taskArray;
  };
  const updateAList = (listToUpdate, updateInfo) => {
    // code to search list array for the listToUpdate, then use updateInfo to update said list
  };
  const updateATask = (taskToUpdate, updateInfo) => {
    // code to search list array for the listToUpdate, then use updateInfo to update said list
  };
  const deleteAList = (listToDelete) => {
    // code to search list array for the listToUpdate, then use updateInfo to update said list
  };
  const deleteATask = (taskToDelete) => {
    // code to search list array for the listToUpdate, then use updateInfo to update said list
  };
  return {
    addNewList,
    addNewTask,
    addListsFromLocalStorage,
    addTasksFromLocalStorage,
    clearAllLists,
    getTheLists,
    getTheTasks,
    updateAList,
    updateATask,
    deleteAList,
    deleteATask,
  };
})();

function storageAvailable(type) {
  var storage;
  try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}

function loadApp() {
  renderHeader();
  renderContent();
  addEvents();
  renderFooter();
};


function renderHeader() {
  const header = document.getElementById('header');
  header.innerHTML = '<header style="display:flex; justify-content: space-between; align-items: center;"><img id="logo" src="images/logo.png"/><h1>Tasks_App</h1><img id="addList" src="images/addList.png"/></header>';
}

function renderContent() {
  getLocalStorage();
  document.getElementById('content').innerHTML = renderAllLists();
}

function getLocalStorage(){
  if (storageAvailable('localStorage')) {
    if("Lists" in localStorage){
      const localStorageLists = JSON.parse(localStorage.getItem("Lists"));
      localStorageLists.forEach( function (list) {
        const storageList = NewList(list.title);
        appStorage.addNewList(storageList);
      });
     }
     if("Tasks" in localStorage){
      const localStorageTasks = JSON.parse(localStorage.getItem("Tasks"));
      localStorageTasks.forEach( function (task) {
        const storageTask = NewTask(task.list, task.title, task.description, task.dueDate, task.priority);
        appStorage.addNewTask(storageTask);
      });
    }
  }
}


function renderFooter() {
  const footer = document.getElementById('footer');
  footer.innerHTML = '<footer style="display:flex; justify-content: space-between; align-items: center;"><h4 id="clearAllLists">Clear All Lists</h4><h3>@2020 Tasks_App</h3><a id="theCodeDiver" href="https://github.com/thecodediver" target="_blank" style="text-align:center;">App Developed By<br>The Code Diver</a></footer>';
}

//EVENT TRIGGERS

function addEvents() {
  const opensListModule = document.getElementById('default-task-list');
  if(opensListModule !== null){
    opensListModule.addEventListener('click', openListModule);
  }

  const opensTaskModule = document.getElementById('create-a-task');
  if(opensTaskModule !== null){
    opensTaskModule.addEventListener('click', openTaskModule);
  }
  
  const cancelListCreation = document.getElementById('cancel-create');
  if(cancelListCreation !== null){
    cancelListCreation.addEventListener('click', closeModule);
  }

  const cancelTaskCreation = document.getElementById('cancel-task-create');
  if(cancelTaskCreation !== null){
    cancelTaskCreation.addEventListener('click', closeTaskModule);
  }
  
  const addNewList = document.getElementById('create-list');
  if(addNewList !== null){
    addNewList.addEventListener('click', createNewList);
  }

  const addNewTask = document.getElementById('create-task');
  if(addNewTask !== null){
    addNewTask.addEventListener('click', createNewTask);
  }

  const enterOnNewListInput = document.getElementById("newList");
  if(enterOnNewListInput !== null){
    enterOnNewListInput.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
          event.preventDefault();
          document.getElementById("create-list").click();
      }
    });
  }

  const singleLists = document.querySelectorAll('.single-list');
  if(singleLists.length > 0){
    singleLists.forEach( function (list) {
      list.addEventListener('click', openListPage);
    });
  }

  const backToLists = document.getElementById('backArrow');
  if(backToLists !== null){
    backToLists.addEventListener('click', function(){
      document.getElementById('content').innerHTML = renderAllLists();
      addEvents();
    });
  }

  const clearAllLists = document.getElementById('clearAllLists');
  if(clearAllLists !== null){
    clearAllLists.addEventListener('click', function(){
      appStorage.clearAllLists();
      document.getElementById('content').innerHTML = renderAllLists();
      addEvents();
    });
  }
}

// EVENT FUNCTIONS 

function openListModule(){
  renderListModule();
}

function openTaskModule(event){
  let ListName = event.target.className;
  renderTaskModule(ListName);
  addEvents();
}

function closeModule(){
  document.getElementById("newListModule").style.opacity= "0";
  document.getElementById("newList").value = "";
  window.setTimeout(function(){
    document.getElementById("newListModule").style.display = "none";
  }, 200);
}

function closeTaskModule(){
  document.getElementById("newTaskModule").style.opacity= "0";
  document.getElementById("newTaskTitle").value = "";
  document.getElementById("newDescription").value = "";
  document.getElementById("newDueDate").value = "";
  window.setTimeout(function(){
    document.getElementById("newTaskModule").style.display = "none";
  }, 200);
}

function createNewList(){
  const newList = document.getElementById('newList').value;
  const filteredListName = filterUserInput(newList);
  if (filteredListName !== "" || filteredListName !== undefined){
    storeNewListData(filteredListName);
    closeModule();
    document.getElementById('content').innerHTML = renderAllLists();
    addEvents();
  } else {
    return false;
  }
}

function createNewTask(){
  const theListName = document.getElementById('listBeingAddedTo').textContent;
  const newTaskTitle = document.getElementById('newTaskTitle').value;
  const newDescription = document.getElementById('newDescription').value;
  const newDueDate = document.getElementById('newDueDate').value;
  const priority = document.getElementById('priority').value;
  const filteredTaskTitle = filterUserInput(newTaskTitle);
  const filteredTaskDescription = filterUserInput(newDescription);

  if (filteredTaskTitle !== "" && filteredTaskTitle !== undefined && filteredTaskDescription !== "" && filteredTaskDescription !== undefined){
    storeNewTaskData(theListName, filteredTaskTitle, filteredTaskDescription, newDueDate, priority);
    closeTaskModule();
    document.getElementById('content').innerHTML = renderListPage(theListName);
    addEvents();
  } else {
    return false;
  }
}

function openListPage(event){
  let listID = event.target.id;
  console.log(listID);
  document.getElementById('content').innerHTML = renderListPage(listID);
  addEvents();
}

function renderListModule() {
  document.getElementById("newListModule").style.display= "block";    
  window.setTimeout(function(){
    document.getElementById("newListModule").style.opacity="1";
  }, 10);
  document.getElementById("newList").focus();
}

function renderTaskModule(listName) {
  console.log(listName);
  document.getElementById("newTaskModule").style.display= "block";    
  window.setTimeout(function(){
    document.getElementById('listBeingAddedTo').textContent = listName;
    document.getElementById("newTaskModule").style.opacity="1";
  }, 10);
  const field = document.getElementById('newDueDate');
  const date = new Date();
  field.value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
    '-' + date.getDate().toString().padStart(2, 0);
  document.getElementById("newTaskTitle").focus();
}

function renderAllLists(){
  let listsHTMLString = '<div id="defaultTaskList"><h1 style="text-align:center;">Task Lists</h1><div id="default-task-list" style="display: flex; justify-content: center; align-items: center"><h3 style="text-align: center;">Create Your First List</h3></div>';
  const currentLists = appStorage.getTheLists();
  if(currentLists.length > 0){
    listsHTMLString = '<div id="defaultTaskList"><h1 style="text-align:center;">Task Lists</h1><div id="default-task-list" style="display: flex; justify-content: center; align-items: center"><h3>Create Another List</h3></div>';
    currentLists.forEach(function (list) {
      listsHTMLString += `<div id="${list.getTitle()}" class="single-list" style="display: flex; justify-content: center; align-items: center">${list.getTitle()}</div>`;
    });
  }
  listsHTMLString += '</div>';
  return listsHTMLString;
}

function renderListPage(listId){
  let listName = listId;
  let singleListHTMLString = `<div id="aListPage"><div id="backArrow"><</div><h1 style="text-align:center;">${listName}</h1><div id="create-a-task" class="${listName}" style="display: flex; justify-content: center; align-items: center">Create Your First Task</div>`;
  let currentList = appStorage.getTheTasks();
  let filteredList = [];
  if(currentList.length > 0){
    singleListHTMLString = `<div id="aListPage"><div id="backArrow"><</div><h1 style="text-align:center;">${listName}</h1><div id="create-a-task" class="${listName}" style="display: flex; justify-content: center; align-items: center">Create Another Task</div>`;
    filteredList = currentList.filter(function (task) {
      return task.getList() === listName;
    });
  }
  if(filteredList.length > 0){
    filteredList.forEach( function (task) {
      singleListHTMLString += `<div id="${task.getTitle()}" class="single-task ${task.getPriority()}" style="display: grid; grid-template-columns: 3fr 1fr; grid-template-rows: 1fr 1fr;"><div style="grid-row: 1; grid-column: 1;">${task.getTitle()}</div><div style="grid-row: 1; grid-column:2;">${task.getDueDate()}</div><div style="grid-row: 2; grid-column: 1;">${task.getDescription()}</div><div style="grid-row: 2; grid-column: 2;">Due in ${task.getDaysUntilDue()} days</div></div>`;
    });
  }
  singleListHTMLString += '</div>';
  return singleListHTMLString;
}

function filterUserInput(inputValue){
  const trimmed = inputValue.trim();
  const removeMalicousCharacters = trimmed.replace(/[|&;$%@"<>()+,]/g, "");
  return removeMalicousCharacters;
}

function storeNewListData(listName) {
  const newList = NewList(listName);
  appStorage.addNewList(newList);
  saveListsToLocalStorage();
}

function storeNewTaskData(list, title, description, dueDate, priority){
  const newTask = NewTask(list, title, description, dueDate, priority);
  appStorage.addNewTask(newTask);
  saveTasksToLocalStorage();
}

function saveListsToLocalStorage() {
  const currentListData = appStorage.getTheLists();
  if (storageAvailable('localStorage')) {
    const listStorageObjectArray = currentListData.map(item => {
      const container = {};
      container.title = item.getTitle();
      return container;
    });
    localStorage.setItem("Lists", JSON.stringify(listStorageObjectArray));
  }
}

function saveTasksToLocalStorage() {
  const currentTaskData = appStorage.getTheTasks();
  if (storageAvailable('localStorage')) {
    const taskStorageObjectArray = currentTaskData.map(item => {
      const container = {};
      container.list = item.getList();
      container.title = item.getTitle();
      container.description = item.getDescription();
      container.dueDate = item.getDueDate();
      container.priority = item.getPriority();
      return container;
    })
    localStorage.setItem("Tasks", JSON.stringify(taskStorageObjectArray));
    console.log(taskStorageObjectArray);
  }
}

const NewList = (listName) => {
  const title = listName;
  const getTitle = () => title;
  return { getTitle };
}

const NewTask = (list, title, description, dueDate, priority) => {
  const fromList = list;
  const taskTitle = title;
  const taskDescription = description;
  const taskDueDate = new Date(dueDate);
  const taskPriority = priority;

  const getList = () => fromList;
  const getTitle = () => taskTitle;
  const getDescription = () => taskDescription;
  const getDueDate = () => new Date( taskDueDate.getTime() - taskDueDate.getTimezoneOffset() * -60000 ).toLocaleDateString("en-US");
  const getPriority = () => taskPriority;

  const getDaysUntilDue = () => {
    const now = new Date();
    const difference = taskDueDate.getTime() - now.getTime();
    const daysDue = Math.floor(difference / (1000 * 3600 * 24));
    return daysDue;
  }
  return {
    getList,
    getTitle,
    getDescription,
    getDueDate,
    getPriority,
    getDaysUntilDue,
  }
}


loadApp();