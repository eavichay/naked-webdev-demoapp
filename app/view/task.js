import TaskController from "../controllers/task.js";
import TaskListController from '../controllers/tasklist.js';
import { Pubsub } from "../core/pubsub.js";
import { BaseView } from "../core/view.js";
import { TASK_EVENTS } from "../events.js";
import { TASK_STATE, Task } from "../model/task.js";

/**
 * @member {Task} model
 */
export class TaskView extends BaseView {

  constructor() {
    super();
    this.unsubs = [];
  }

  static template = /*html*/`
    <input placeholder="Untitled Task" data-id="title">
    <textarea data-id="description" placeholder="No Description" rows="8"></textarea>
    <button data-id="todo" data-action="state">Todo</button>
    <button data-id="in-progress" data-action="state">In-Progress</button>
    <button data-id="done" data-action="state">Done</button>
    <hr/>
    <button data-id="delete" data-action="delete">DELETE</button>
    <span data-id="taskId"><span>
  `;
  static elementType = 'div';
  static get controller() { return TaskController };

  init(view, template, model) {
    /** @type Pubsub */
    const bus = this.inject.taskEventBus;
    this.unsubs.push(
      bus.on(TASK_EVENTS.TASK_UPDATED, (/** @type {Task} */ task) => task.taskId === this.model.taskId && this.update()),
    );
    super.init(view, template, model);
  }

  createView(model) {
    const dom = super.createView(model);
    dom.setAttribute('data-role', 'task-card');
    dom.setAttribute('data-state', this.model.state);
    this.findId('title').onchange = ({target}) => this.model.title = target.value;
    this.findId('description').onchange = ({target}) => this.model.description = target.value;
    this.findId('todo').onclick = () => TaskListController.changeState(this, TASK_STATE.TODO);
    this.findId('in-progress').onclick = () => TaskListController.changeState(this, TASK_STATE.IN_PROGRESS);
    this.findId('done').onclick = () => TaskListController.changeState(this, TASK_STATE.DONE);
    this.findId('delete').onclick = () => TaskListController.deleteTask(this);
    return dom;
  }

  update() {
    this.mountPoint.setAttribute('data-state', this.model.state);
    this.findId('title').value = this.model.title;
    this.findId('description').value = this.model.description;
    this.findId('taskId').textContent = this.model.taskId;
  }

  destroy () {
    this.unsubs.forEach(unsub => unsub());
    this.mountPoint.remove();
  }
}