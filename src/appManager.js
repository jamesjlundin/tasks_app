import {appStorage} from './index'
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
  if(isLocalInfo()){
    document.getElementById('content').innerHTML = renderLocalInfo();
  } else {
    document.getElementById('content').innerHTML = renderDefaultInfo();
  }
}

function isLocalInfo(){
  return false;
}

function renderDefaultInfo() {
  return '<div id="defaultTaskList"><h1 style="text-align:center;">Task Lists</h1><div id="default-task-list" style="display: flex; justify-content: center; align-items: center"><h3>Create Your First List</div></div>';
}

function renderLocalInfo(){
  const infoArray = getLocalInfo();
}

function getLocalInfo(){

}


function renderFooter() {
  const footer = document.getElementById('footer');
  footer.innerHTML = '<footer style="display:flex; justify-content: space-between; align-items: center;"><h4 id="clearAllProjects">Clear All Projects</h4><h3>@2020 Tasks_App</h3><a href="https://github.com/thecodediver" target="_blank" style="text-align:center;">App Developed By<br>The Code Diver</a></footer>';
}

//EVENT TRIGGERS

function addEvents() {
  const defaultEvents = document.getElementById('default-task-list');
  defaultEvents.addEventListener('click', openModule);

  const cancelListCreation = document.getElementById('cancel-create');
  cancelListCreation.addEventListener('click', closeModule);

  const addNewList = document.getElementById('create-list');
  addNewList.addEventListener('click', createNewList);
}



// EVENT FUNCTIONS 

function openModule(){
  renderListModule();
}

function closeModule(){
  document.getElementById("newListModule").style.opacity= "0";    
  window.setTimeout(function(){
    document.getElementById("newListModule").style.display = "none";
  }, 200);
}

function renderListModule() {
  document.getElementById("newListModule").style.display= "block";    
  window.setTimeout(function(){
    document.getElementById("newListModule").style.opacity="1";
  }, 10);
}

function createNewList(){
  const newList = document.getElementById('newList').value;
  const filteredListName = filterUserInput(newList);
  if (filteredListName !== "" || filteredListName !== undefined){
    storeNewListData(filteredListName);
  } else {
    return false;
  }
  
}

function filterUserInput(inputValue){
  const trimmed = inputValue.trim();
  const removeMalicousCharacters = trimmed.replace(/[|&;$%@"<>()+,]/g, "");
  return removeMalicousCharacters;
}

function storeNewListData(listName) {
  const newName = NewList(listName);
  appStorage.addNewList(newName);
}

const NewList = (listName) => {
  const title = listName;
  const getTitle = () => title;
  return { getTitle }
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
  const getDueDate = () => taskDueDate;
  const getPriority = () => taskPriority;

  const getDaysUntilDue = () => {
    const now = new Date();
    const difference = dueDate.getTime() - now.getTime();
    const daysDue = difference / (1000 * 3600 * 24);
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





export {loadApp}