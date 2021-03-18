import { BaseController } from "../core/controller.js";
import { Pubsub } from "../core/pubsub.js";
import { TASK_EVENTS } from "../events.js";
import { TaskView } from "../view/task.js";
import TaskListController from './tasklist.js';

class TaskController extends BaseController {
  ready() {
    /** @type {Pubsub} */
    const bus = this.inject.taskEventBus;
    bus.on(TASK_EVENTS.TASK_ADDED, (task) => {
        const view = new TaskView();
        view.createView(task);
        TaskListController.addTask(view);
    });
  }
}

export default new TaskController();
