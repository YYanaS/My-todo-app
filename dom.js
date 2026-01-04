function $(selector) {
    return document.querySelector(selector)
}

const root = $('#root')
const formElement = $('#form')
const todoInputElement = $('#todoInput')
const deleteAllElement = $('.todo-controls__button_delete-all')
const deleteLastElement = $('.todo-controls__button_delete-last')
const showAllElement = $('.filter-controls__button_show-all')
const showCompletedElement = $('.filter-controls__button_show-completed')
const searchElement = $('.filter-controls__search')

const todoListElement = document.createElement('div')
todoListElement.className = 'todo-list'
root.append(todoListElement)

export {
    root,
    formElement,
    todoInputElement,
    deleteAllElement,
    deleteLastElement,
    showAllElement,
    showCompletedElement,
    searchElement,
    todoListElement,
    $
}