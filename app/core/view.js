import { BaseController } from "./controller.js";
import { DependencyMixin } from "./dependency.js";

export class BaseView extends DependencyMixin(class {}) {
  static elementType = "div";
  static template = "";
  static inject = ['taskEventBus'];

  /**
   * 
   * @param {any} model 
   * @returns {HTMLElement}
   */
  createView(model) {
    const node = document.createElement(this.constructor.elementType);
    /**
     * @type {BaseController}
     */
    this.init(node, this.constructor.template, model);
    return node;
  }
  /**
   * @param {HTMLElement} view
   * @param {string} template
   * @param {data} any
   */
  init(view, template, model) {
    this.mountPoint = view;
    this.template = template;
    this.model = model;
    this.render();
  }

  /**
   *
   * @param {string} query
   * @returns {HTMLElement}
   */
  findId(query) {
    return this.mountPoint.querySelector(`[data-id="${query}"]`);
  }

  /**
   *
   * @param {string} query
   * @returns {HTMLElement[]}
   */
  findAll(query) {
    return Array.from(this.mountPoint.querySelectorAll(query));
  }

  render() {
    /** @type {HTMLTemplateElement} */
    const tplElem = document.createElement("template");
    tplElem.innerHTML = this.template || "";
    this.dom = tplElem.content.cloneNode(true);
    this.mountPoint.appendChild(this.dom);
    this.update();
  }

  update() {}

  destroy() {}
}
