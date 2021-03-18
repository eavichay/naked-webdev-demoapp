import { BaseController } from "../core/controller.js";
import { Pubsub } from "../core/pubsub.js";
import { Task, TaskList } from '../model/task.js';
import { TASK_EVENTS } from "../events.js";
import { TaskView } from "../view/task.js";

class TaskListController extends BaseController {
  static inject = [...super.inject, 'tasks'];
  constructor() {
    super();
    /** @type {Pubsub} */
    const bus = this.inject.taskEventBus;
  }

  /**
   * @param {TaskView} taskview 
   */
  addTask(taskView) {
    /** @type {Task} */
    const task = taskView.model;
    const { state } = task;
    const node = document.querySelector(`task-list[state="${state}"]`);
    if (node) {
      node.appendChild(taskView.mountPoint);
    }
  }

  changeState(taskView, state) {
    taskView.model.state = state;
    const node = document.querySelector(`task-list[state="${state}"]`);
    if (node) {
      node.appendChild(taskView.mountPoint);
    }
  }

  deleteTask(taskView) {
    /** @type {TaskList} */
    const tasklist = this.inject.tasks;
    tasklist.remove(taskView.model);
    taskView.destroy();
  }
}

export default new TaskListController();
