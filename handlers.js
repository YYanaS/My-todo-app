import {
    deleteAllElement,
    deleteLastElement,
    formElement, searchElement,
    showAllElement,
    showCompletedElement, todoInputElement,
    todoListElement
} from "./dom.js"

import {
    data,
    renderTodos,
    setData,
    updateCounters,
    Todo
} from "./script.js"

// Add listeners---------------------------------------------------------------------------------------
formElement.addEventListener('submit', handleFormSubmit) //Слушатель отправки формы
deleteAllElement.addEventListener('click', handleButtonDeleteAll) //Слушатель удаления всех задач
todoListElement.addEventListener('click', handleButtonDeleteItem) //Слушатель удаления текущей задачи
todoListElement.addEventListener('click', handleTodoCheckbox) // Слушатель отметки выполениея задачи
window.addEventListener('storage', handleStorageChange) //Слушатель перезагрузки страницы
deleteLastElement.addEventListener('click', handleButtonDeleteLast) // Слушатель удаления последней задачи
showAllElement.addEventListener('click', handleButtonShowAll) // Слушатель отображения всех задач
showCompletedElement.addEventListener('click', handleButtonShowCompleted) // Слушатель отображения выполненных задач
searchElement.addEventListener('input', handleSearch) //Слушатель поиска задач

// Handlers--------------------------------------------------------------------------------------------
//Обработчик добавления новой задачи
function handleFormSubmit(event) {
    event.preventDefault() //Отменям стандартное поведение кнопки в форме

    const inputValue = todoInputElement.value.trim() //У значения поля input убираем проблемы в начале/конце сроки
    if (!inputValue) return
    const todo = new Todo(inputValue)

    data.push(todo)

    renderTodos(data) //Отрисовываем список задач
    setData() //Сохранение изменение в localStorage
    updateCounters() //Обновление значений счетчиков

    todoInputElement.value = ''
}

//Обработчик удаления всех задач
function handleButtonDeleteAll(event) {
    data.length = 0 //Очищаем массив объектов
    todoListElement.innerHTML = '' //Удалаем всё HTML содержимое внутри списка задач
    setData() //Сохранение изменение в localStorage
    updateCounters() //Обновление значений счетчиков
}

//Обработчик удаления текущей задачи
function handleButtonDeleteItem(event) {
    const deleteBtn = event.target.closest('.todo-item__button') //От элемента на котором произошло событие ищем ближайщий элемент по классу
    if (deleteBtn) {
        const todoItemId = deleteBtn.parentElement.dataset.id //Получаем id задачи соответствующего атрибуду data-id родительского элемента
        const index = data.findIndex(todo => todo.id === todoItemId) //Ищем индекс задачи в массиве объектов по её ID

        if (index != -1) {
            data.splice(index, 1) //Из массива данных удаляем 1 элемент начиная с index
            renderTodos(data) //Отрисовываем список задач
            setData() //Сохранение изменение в localStorage
            updateCounters() //Обновление значений счетчиков
        }
    }
}

//Обработчик сохранения состояния задачи
function handleTodoCheckbox(event) {
    if (event.target.classList.contains('todo-item__checkbox')) { //Получаем список классов от элемента, на котором произошло событие и проверяем, есть ли в этом списке класс todo-item__checkbox
        const checkbox = event.target //Получаем чекбокс на котором произошло событие
        const todoItem = checkbox.closest('.todo-item') //От этого чекбокса находим ближайший родительский элемент с классом todo-item
        const todoItemId = todoItem.dataset.id //Из атрибута data олучаем id родительского элемента (всей карточки задачи)
        const todoIndex = data.findIndex(item => item.id === todoItemId) // В массиве данных data ищем элемент, id котрого равен id полученному выше
        const textLabel = todoItem.querySelector('.todo-item__text') //Внутри текущей карточки задач находим элемент  с классом todo-item__text

        if (todoIndex != -1) { //Проверяемб чтобы задача была найдена в массиве
            data[todoIndex].isCompleted = !data[todoIndex].isCompleted //Меняем значение свойства isCompleted на противоположное

            const checkboxKey = `checkbox_${todoItemId}`
            localStorage.setItem(checkboxKey, JSON.stringify(data[todoIndex].isCompleted)) //В localStorage создаем ключ checkboxKey и сохраняем в него строку со значением, записаным в свойстве isCompleted

            if (data[todoIndex].isCompleted) { //Условие для добавление/удаление атрибута checked
                checkbox.setAttribute('checked', 'checked')
            } else {
                checkbox.removeAttribute('checked')
            }
            textLabel.classList.toggle('todo-item__text_completed') //Добавление класса при, если его нет и удаление, если есть
            todoItem.classList.toggle('todo-item_completed') //Добавление класса при, если его нет и удаление, если есть

            setData() //Сохранение изменение в localStorage
            updateCounters(data) //Обновление значений счетчиков
        }
    }
}

//Обработчик изменения данных в localStorage
function handleStorageChange(event) {
    if (event.key === 'todos') { //Проверяем произошло ли изменение в ключе todos в localStorage
        if (event.newValue) { //Проверяем наличие нового значения
            const newData = JSON.parse(event.newValue) //Парсим новый массив задач
            renderTodos(newData) // Отрисовка списка задач
            updateCounters(newData) //Обновление значений счетчиков
        }
    } else if (event.key && event.key.startsWith('checkbox_')) { // Если изменяется только состояние чекбокса
        if (event.newValue) {
            const todoItemId = event.key.replace('checkbox_', '') //Получаем id задачи
            const todoIndex = data.findIndex(item => item.id === todoItemId) //Ищем индекс задачи в основном массиве

            if (todoIndex !== -1) { //Проверка на наличие этой задачи в массиве
                const newState = JSON.parse(event.newValue) //Парсим значение из хранилища
                data[todoIndex].isCompleted = newState //Обновляем значение свойства isCompleted в задачи
                updateCounters(data) //Обновляем значение счетчика
            }
        }
    }
}

//Обработчик отображения всех задач
function handleButtonShowAll(event) {
    renderTodos(data) //Отрисавать массив всех задач
}

//Обработчик отображения выполненных задач
function handleButtonShowCompleted(event) {
    const completed = data.filter(task => task.isCompleted) //Фильтруем массив данных и сосздаем новый массив, у объектов которого isCompleted === true
    renderTodos(completed) //Отрисовываем задачи для нового массива данных
}

//Обработчик удаление последней задачи
function handleButtonDeleteLast(event) {
    data.pop() //Удаление последнего элемента массива данных
    setData() //Сохранение изменение в localStorage
    updateCounters() //Обновляем значение счетчика
    renderTodos(data) // Отрисавать массив всех задач
}

//Обработчик поиска задач
function handleSearch(event) {
    const searchTerm = event.target.value.trim().toLowerCase() //Получаем значение из поля для ввода, удаляем в начале и в конце пробелы, привидим к нижнему регистру

    if (searchTerm === '') { //Если строка поиска пустая, отрисовываем все задачи
        renderTodos(data)
    } else {
        const filteredData = data.filter(todo => todo.title.toLowerCase().includes(searchTerm)) //Приводим загоаловки задач к нижнему регистру и проверяем содержится ли искомая подстрока в загаловках задач, если содержится добавляем такую задачу в новый массив
        renderTodos(filteredData) //Отрисовываем новый массив
    }
}
