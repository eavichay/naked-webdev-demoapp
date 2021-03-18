import { TaskList } from './model/task.js';
import { register } from './core/dependency.js';
import { Pubsub } from './core/pubsub.js';

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
]).then(() => {
    taskList.add();
    taskList.add();
    taskList.add();
});
