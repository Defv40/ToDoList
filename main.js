const body = document.querySelector("body");
const btnCreateTask = document.querySelector("#btnCreateTask");
const textForTask = document.querySelector("#task");
const wrapperForTasks = document.querySelector(".wrapper");
//const label = document.querySelector("#label");
const divInput = document.querySelector(".input");
let currentItemInLocalStorage = 0;
//LoadFromLocalStorage();

window.addEventListener("storage", (e) =>{
    console.log(e);
    location.reload();
});


StartApp();

function StartApp(){

   
    document.onkeydown = function(e){
        if(e.code == "Enter") CreateTask();
    }

    currentItemInLocalStorage = FindMaximumIndex() + 1;
    divInput.style.cssText = `
        display: flex;
        gap: 5px;
        align-items: center;
        max-width: 400px;
        margin: 30px auto;
    `;
    textForTask.placeholder = "Задача";
    textForTask.style.cssText = `
        padding: 5px 15px;
        font-size: 30px;
        font-family: Roboto, sans-serif;
    `;
    btnCreateTask.style.cssText = `
        border: none;
        outline: none;
        font-size: 22px;
        padding: 10px 15px;
        background-color: #c1bbeb;
        border-radius: 5px;
        cursor: pointer;
    `;
    btnCreateTask.addEventListener("click", CreateTask);

    LoadFromLocalStorage();
}

function CheckValidInputField(){
    if (textForTask.value.length <= 0){
        alert("Введите описание задачи");
        return false;
    } 
    return true;
}

function CreateTask(isFormStorage, key){
    
    if (isFormStorage !== true && !CheckValidInputField()) return;
    const btnComplt = CreateCompleteButton();
    const btnDel = CreateDeleteButton();
    // объеднинение кнопок в один div
    const btnsDiv = document.createElement("div");
    if (isFormStorage === true){
        const desc = CreateDescription(localStorage.getItem(key));
        btnsDiv.append(btnComplt, btnDel);
        const block = CreateBlock(desc, btnsDiv, key);
        wrapperForTasks.append(block);
        return;
    }
    const desc = CreateDescription();
    btnsDiv.append(btnComplt, btnDel);
    // Запихнуть все элементы в один объект 
    const block = CreateBlock(desc, btnsDiv);
    // Загрузка в localstorage
    SaveInLocalStorage(block);
    // Создание на странице
    wrapperForTasks.append(block);
    textForTask.value = "";
}

function SaveInLocalStorage(item){
    localStorage.setItem(item.classList[0], item.childNodes[0].innerText);
    if (currentItemInLocalStorage > 10000){
        currentItemInLocalStorage = 0;
    }
    currentItemInLocalStorage++;
}

function DeleteFromLocalStorage(item){
    localStorage.removeItem(item.classList[0]);
}

function LoadFromLocalStorage(){
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            CreateTask(true, key);
        }
    }
}

function FindMaximumIndex(){
    let max = 0;
    for (const elem in localStorage) {
        if (localStorage.hasOwnProperty(elem)){
            if (max < +elem) max = +elem;
        }       
    }
    return max;
}

function CreateCompleteButton(){
    // Кнопка выполенной задачи
    const btnComplete = document.createElement("button");
    btnComplete.innerText = "Выполнено";
    btnComplete.addEventListener("click", (e)=>{
        const parent = e.target.parentNode.parentNode;
      
        if (parent.style.backgroundColor == "white")
            parent.style.backgroundColor = "rgba(187, 235, 193, .7)";
        else
            parent.style.backgroundColor = "white";

    })
    btnComplete.style.cssText = `
        outline: none;
        border: none;
        background-color: #85EB6A;
        text-align: center;
        border-radius: 5px;
        font-size: 20px;
        color: black;
        margin-right: 5px;
        padding: 10px;
        cursor: pointer;
    `;
    return btnComplete;
}

function CreateDeleteButton(){
    // Кнопка Удаления задачи
    const btnDelete = document.createElement("button");
    btnDelete.innerText = "Удалить"
    btnDelete.addEventListener("click", (e)=>{
        const parent = e.target.parentNode.parentNode;
        DeleteFromLocalStorage(parent);
        parent.remove();
    })
    btnDelete.style.cssText = `
        outline: none;
        border: none;
        background-color: #fccccc;
        border-radius: 5px;
        font-size: 20px;
        color: black;
        padding: 10px;
        cursor: pointer;
    `
    return btnDelete;
}

function CreateBlock(descriptionDiv, btnsDiv, key){
    const block = document.createElement("div");
    block.append(descriptionDiv, btnsDiv);
    if (key !== undefined)
        block.classList.add(key);
    else
        block.classList.add(currentItemInLocalStorage);
    block.style.cssText = `
        font-size: 40px;
        border: 1px solid gray;
        border-radius: 5px;
        display: flex;
        padding: 10px;
        font-family: Roboto, sans-serif;
        justify-content: space-between;
        max-width: 800px;
        margin: 20px auto;
        background-color: white;
        word-wrap: break-word;
    `;
    return block;
}

function CreateDescription(textFromStorage){
    // Описание задачи
    const descriptionDiv = document.createElement("div");
    if (textFromStorage !== undefined)
        descriptionDiv.innerText = textFromStorage;
    else 
        descriptionDiv.innerText = textForTask.value;
    descriptionDiv.style.cssText = `
        padding: 10px 20px;
        max-width: 450px;
        word-wrap: break-word;
    `
    return descriptionDiv;
}