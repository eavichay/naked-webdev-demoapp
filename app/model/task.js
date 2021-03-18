import { DependencyMixin } from "../core/dependency.js";
import { TASK_EVENTS } from "../events.js";

let gloablId = 1;

/**
 * @enum
 */
export const TASK_STATE = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
};

export function updateGlobalId(task) {
  gloablId = Math.max(gloablId, task.taskId + 1);
}

export class Task extends DependencyMixin(Object) {
  static inject = ["taskEventBus"];

  constructor(title = "", description = "", customId = gloablId) {
    super(title, description);
    this.taskId = customId;
    this._state = TASK_STATE.TODO;
    this._title = title;
    this._description = description;
    this._isConstructed = true;
    updateGlobalId(this);
  }

  get title() {
    return this._title;
  }
  set title(v) {
    this._title = v;
    if (this._isConstructed)
      this.inject.taskEventBus.broadcast(TASK_EVENTS.TASK_UPDATED, this);
  }

  get description() {
    return this._description;
  }
  set description(v) {
    this._description = v;
    if (this._isConstructed)
      this.inject.taskEventBus.broadcast(TASK_EVENTS.TASK_UPDATED, this);
  }

  get state() {
    return this._state;
  }
  set state(v) {
    console.assert(Object.values(TASK_STATE).includes(v));
    this._state = v;
    if (this._isConstructed)
      this.inject.taskEventBus.broadcast(TASK_EVENTS.TASK_UPDATED, this);
  }

  toJSON() {
    const { state, description, title, taskId } = this;
    return {
      state,
      description,
      title,
      taskId,
    };
  }
}

export class TaskList extends DependencyMixin(Object) {
  static inject = ["taskEventBus"];

  constructor() {
    super();
    this.tasks = [];
  }

  add(task = new Task()) {
    if (!this.tasks.includes(task)) {
      this.tasks.push(task);
      this.inject.taskEventBus.broadcast(TASK_EVENTS.TASK_ADDED, task);
    }
  }

  remove(task) {
    const idx = this.tasks.indexOf(task);
    if (idx >= 0) {
      this.tasks.splice(idx, 1);
      this.inject.taskEventBus.broadcast(TASK_EVENTS.TASK_REMOVED, task);
    }
  }
}
