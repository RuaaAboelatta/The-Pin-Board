var titleInput = document.getElementById('task-title')
var descriptionInput = document.getElementById('task-description')
var prioritySelect = document.getElementById('task-priority')
var taskContainer= document.getElementById('task-container')
var modalContainer = document.getElementById('modal-container')

//buttons
var createBtn = document.getElementById('create-btn')
var allBtn = document.getElementById('all-btn')
var activeBtn = document.getElementById('active-btn')
var completedBtn = document.getElementById('completed-btn')
var clearBtn = document.getElementById('clear-btn')
var modalBtn = document.getElementById('modal-btn')
var closeModalBtn = document.getElementById('close-modal-btn')


var tasks = []
var currentFilter = 'all'
var modalState = 'closed'

function toggleModal(state){
    modalState = state
    if (state === 'closed'){
        modalContainer.classList.add('closed-modal')
    }else{
        modalContainer.classList.remove('closed-modal')
    }
}
modalBtn.addEventListener('click', ()=>{
    toggleModal('opened')
})
closeModalBtn.addEventListener('click', ()=>{
    toggleModal('closed')
})

function getTasks(){
    var allTasks = localStorage.getItem('tasks')
    if (allTasks) {
        tasks = JSON.parse(allTasks)
    } else {
        tasks = []
    }
}

function saveTasks(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}


// CRUD functions
function createTask(event){
    event.preventDefault() 
    var taskTitle = titleInput.value.trim()
    var taskDescription = descriptionInput.value.trim()
    var taskPriority = prioritySelect.value
    if (!taskTitle) {
        alert('Please enter a task title')
        return
    }
    var newTask = {
        id: Date.now(),
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        completed: false
    }
    tasks.push(newTask)
    saveTasks()

    titleInput.value = ''
    descriptionInput.value = ''
    prioritySelect.value = 'medium'
    applyFilter(currentFilter)
    toggleModal('closed')
}
createBtn.addEventListener('click', createTask)

function toggleTaskComp(id){
    tasks = tasks.map((task)=>{
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    })
    saveTasks()
    applyFilter(currentFilter)
}

function deleteTask(id){
    tasks = tasks.filter((task)=>{
        return task.id !== id
    })
    saveTasks()
    applyFilter(currentFilter)
}

function clearCompleted(){
    tasks = tasks.filter(function(task) {
        return task.completed === false
    })
    saveTasks()
    applyFilter(currentFilter)
}
clearBtn.addEventListener('click', clearCompleted)

// Displaying tasks
function displayTasks(tasks) {
    taskContainer.innerHTML = tasks.map((task)=>{
        return`
            <div class="task task-${task.priority} ${task.completed ? "checked" : ""}">
                <div class="pin pin-${task.priority}"></div>
                <h2>${task.title}</h2>
                <p>${task.description}</p>
                <div class="icons">
                    <i class="fa-solid ${task.completed ? "fa-x" : "fa-check"} " onclick="toggleTaskComp(${task.id})"></i>
                    <i class="fa-regular fa-trash-can"  onclick="deleteTask(${task.id})"></i>
                </div>
            </div>
        `
    }).join('')
}


//Filtering
function applyFilter(filter){
    currentFilter = filter
    allBtn.classList.remove('active-btn')
    activeBtn.classList.remove('active-btn')
    completedBtn.classList.remove('active-btn')

    switch(filter){
        case 'all' :
            if (tasks.length === 0) {
                taskContainer.innerHTML = `<p class="empty-message">
                                                <i class="fa-solid fa-asterisk"></i>
                                                Create Your First Task! 
                                            </p>`
            } else {
                displayTasks(tasks)
            }
            allBtn.classList.add('active-btn')
            break
        case 'active' :
            var activeTasks = tasks.filter((task)=>{
                return task.completed === false
            })
            if (activeTasks.length === 0) {
                taskContainer.innerHTML = `<p class="empty-message">
                                                <i class="fa-solid fa-asterisk"></i>
                                                No Active Tasks 
                                            </p>`
            } else {
                displayTasks(activeTasks)
            }
            activeBtn.classList.add('active-btn')
            break
        case 'completed' :
            var completedTasks = tasks.filter((task)=>{
                return task.completed === true
            })
            if (completedTasks.length === 0) {
                taskContainer.innerHTML = `<p class="empty-message">
                                                <i class="fa-solid fa-asterisk"></i>
                                                No Completed Tasks, Yet 
                                            </p>`
            } else {
                displayTasks(completedTasks)
            }
            completedBtn.classList.add('active-btn')
            break
        default:
            displayTasks(tasks)

    }
}

allBtn.addEventListener('click', ()=>{
    applyFilter('all')
    var taskCards = document.querySelectorAll('.task')
    taskCards.forEach(function(task) {
        task.classList.add('animate')
    })
})

activeBtn.addEventListener('click', ()=>{
    applyFilter('active')
    var taskCards = document.querySelectorAll('.task')
    taskCards.forEach(function(task) {
        task.classList.add('animate')
    })
})

completedBtn.addEventListener('click', ()=>{
    applyFilter('completed')
    var taskCards = document.querySelectorAll('.task')
    taskCards.forEach(function(task) {
        task.classList.add('animate')
    })
})


getTasks()
applyFilter('all')