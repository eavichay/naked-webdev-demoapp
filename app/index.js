import { TaskList, Task } from './model/task.js';
import { register } from './core/dependency.js';
import { Pubsub } from './core/pubsub.js';
import { TASK_EVENTS } from './events.js';

// provide the message bus
const tasksMessageBus = new Pubsub();
tasksMessageBus.DEBUG = true;
register('taskEventBus', () => tasksMessageBus);

// provide the task list
const taskList = new TaskList();
register('tasks', () => taskList);

// launch the app
Promise.all([
    import('./controllers/tasklist.js'),
    import('./controllers/task.js'),
    import('./view/header.js')
]).then(() => {
    rebuildFromLocalStorage();
});

function rebuildFromLocalStorage() {
    const raw = localStorage.getItem('naked-tasks') || '[]';
    /** @type {Task[]} */
    const data = JSON.parse(raw);
    data.forEach(task => {
        const newTask = new Task(task.title, task.description, task.taskId);
        newTask.state = task.state;
        taskList.add(newTask);
    });
    tasksMessageBus.on(TASK_EVENTS.TASK_ADDED, save);
    tasksMessageBus.on(TASK_EVENTS.TASK_UPDATED, save);
    tasksMessageBus.on(TASK_EVENTS.TASK_REMOVED, save);
}

let isSaving = false;

async function save() {
    if (isSaving) {
        requestAnimationFrame(() => save());
    }
    isSaving = true;
    await Promise.resolve();
    localStorage.setItem('naked-tasks', JSON.stringify(taskList.tasks));
    isSaving = false;
}