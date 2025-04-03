document.addEventListener("DOMContentLoaded", ()=> {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = storedTasks;
    updateTaskList(); 
    updateStats();
});

let tasks = [];

const addTask = () => {
    const taskInput = document.getElementById("taskinput");
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = "";
        updateTaskList();
        saveTasks();
    }
};

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const updateTaskList = () => {
    const taskList = document.querySelector(".task-list");
    taskList.innerHTML = ''; 

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? "completed" : ""}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskComplete(${index})" />
                    <p class="task-text" ondblclick="editTask(${index}, this)">${task.text}</p>
                </div> 
                <div class="icons">
                    <img src="./img/edit.png" onclick="editTask(${index}, this)" />
                    <img src="./img/bin.png" onclick="deleteTask(${index})" />
                </div>
            </div>
        `;

        taskList.appendChild(listItem);
    });

    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    document.getElementById("numbers").textContent = `${completedTasks} / ${totalTasks}`;
    
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    document.getElementById("progress").style.width = `${progress}%`;
    document.getElementById("numbers").innerHTML = `${completedTasks} / ${totalTasks}`;
    
    if(tasks.length && completedTasks === totalTasks){
        blaskConfetti();
    }
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
    updateTaskList();
};

const editTask = (index, element) => {
    const taskText = element.closest(".taskItem").querySelector(".task-text");
    const input = document.createElement("input");
    input.type = "text";
    input.value = tasks[index].text;
    input.className = "edit-input";

    taskText.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => saveEdit(index, input));
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") saveEdit(index, input);
    });
};

const saveEdit = (index, input) => {
    const newText = input.value.trim();
    if (newText !== "") {
        tasks[index].text = newText;
        saveTasks();
    }
    updateTaskList();
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    updateTaskList();
};

document.getElementById('newTask').addEventListener('click', function(e) {
    e.preventDefault();
    addTask();
});

const blaskConfetti = () => {
    const count = 200,
        defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};
