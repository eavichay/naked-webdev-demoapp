import { DependencyMixin } from "./dependency.js";

export class BaseController extends DependencyMixin(class {}) {
    static inject = ['taskEventBus'];
}