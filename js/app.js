var titleInput = document.getElementById('task-title')
var descriptionInput = document.getElementById('task-description')
var prioritySelect = document.getElementById('task-priority')
var taskContainer= document.getElementById('task-container')
var createBtn = document.getElementById('create-btn')
var allBtn = document.getElementById('all-btn')
var activeBtn = document.getElementById('active-btn')
var completedBtn = document.getElementById('completed-btn')


var tasks = []
var currentFilter = 'all'

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
        description: taskDescription || 'No description',
        priority: taskPriority,
        completed: false
    }
    tasks.push(newTask)
    saveTasks()

    titleInput.value = ''
    descriptionInput.value = ''
    prioritySelect.value = 'medium'
    applyFilter(currentFilter)
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

// Displaying tasks
function displayTasks(tasks) {
    console.log('All tasks:', tasks)
    taskContainer.innerHTML = tasks.map((task)=>{
        return`
            <div class="task ${task.completed ? "checked" : ""}">
                <div class="pin pin-${task.priority}"></div>
                <h2>${task.title}</h2>
                <p>${task.description}</p>
                <div class="icons">
                    <i class="fa-solid ${task.completed ? "fa-x" : "fa-check"} " onclick="toggleTaskComp(${task.id})"></i>
                    <i class="fa-solid fa-trash"  onclick="deleteTask(${task.id})"></i>
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
            displayTasks(tasks)
            allBtn.classList.add('active-btn')
            break
        case 'active' :
            activeTasks = tasks.filter((task)=>{
                return task.completed === false
            })
            displayTasks(activeTasks)
            activeBtn.classList.add('active-btn')
            break
        case 'completed' :
            completedTasks = tasks.filter((task)=>{
                return task.completed === true
            })
            displayTasks(completedTasks)
            completedBtn.classList.add('active-btn')
            break
        default:
            displayTasks(tasks)

    }
}

allBtn.addEventListener('click', ()=>{
    applyFilter('all')
})

activeBtn.addEventListener('click', ()=>{
    applyFilter('active')
})

completedBtn.addEventListener('click', ()=>{
    applyFilter('completed')
})


getTasks()
applyFilter('all')