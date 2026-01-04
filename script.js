import {
    todoListElement,
    $
} from "./dom.js"

import "./handlers.js"

// Variables-------------------------------------------------------------------------------------------
let data = getData() || []  //Если getData() - null/undefined в переменную записывается пустой массив


renderTodos(data) //Первая отрисовка списка задач
updateCounters() //Обновление счетчика при зашоузке страницы страницы 

//Auxiliary function------------------------------------------------------------------------------------
//Сохранеение данных в localStorage
function setData() {
    const dataJSON = JSON.stringify(data) //Приводим массив данных к JSON-строке
    localStorage.setItem('todos', dataJSON) //Записываем эту строку в значение ключа todos в localStorage
}

//Получение данных из localStorage
function getData() {
    if (localStorage.getItem('todos')) { //Проверяем наличие ключа todos
        const storedData = localStorage.getItem('todos')

        if (storedData !== null && storedData !== undefined) { // Проверяем, что полученные данные не равны null и не равны undefined
            const parsedData = JSON.parse(storedData) // Преобразуем JSON-строку обратно в массив

            parsedData.forEach(todo => {
                const checkboxKey = `checkbox_${todo.id}`
                const savedCheckboxState = localStorage.getItem(checkboxKey) //Получаем состояние чекбока для каждой задачи
                if (savedCheckboxState !== null) { //Проверяем наличие ключа в localStorage
                    todo.isCompleted = JSON.parse(savedCheckboxState) //Записываем состояние свойства isCompleted
                }
            })
            return parsedData
        }
    }
    return null
}

//Обновление счетчиков задач
function updateCounters() {
    const total = data.length
    const completed = data.filter(task => task.isCompleted).length //Проводим поиск и получаем новый массив со значением isCompleted === true, вычисляем колличествчо элементов этого массива

    $('.filter-controls__counter_completed').textContent = `Completed: ${completed}`
    $('.filter-controls__counter_all').textContent = `All: ${total}`
}

// Constructors----------------------------------------------------------------------------------------
function Todo(title) {
    this.title = title
    this.id = crypto.randomUUID()
    this.isCompleted = false
    this.createDate = new Date().toISOString()
}

// Helper-----------------------------------------------------------------------------------------------
function buildTodoTemplate(todo) {
    const { id, title, createDate, isCompleted } = todo // Деструктуризация объекта todo
    const formattedDate = new Date(createDate)
    const isChecked = isCompleted ? 'checked' : ''
    const completedClass = isCompleted ? 'todo-item__text_completed' : ''
    const itemCompletedClass = isCompleted ? 'todo-item_completed' : ''

    return `
    <div class="todo-item ${itemCompletedClass}" data-id="${id}">
        <button class="todo-item__button">X</button>
            <div class="todo-item__wrapper">
                <input id="todo-${id}" class="todo-item__checkbox" type="checkbox" ${isChecked}>
                <label for="todo-${id}" class="todo-item__text ${completedClass}">${title}</label>
            </div>
         <p class="todo-item__date">${formattedDate.toLocaleDateString()}</p>
    </div>
  `
}

// Render-----------------------------------------------------------------------------------------------
function renderTodos(todos) {
    const html = todos.reduce((acc, todo) => acc + buildTodoTemplate(todo), '') //Для кажой задачи поочередно отрисовываем html
    todoListElement.innerHTML = html //Встраиваем строку в DOM с применением стилей
}

export {
    $,
    data,
    renderTodos,
    setData,
    getData,
    updateCounters,
    Todo,
}