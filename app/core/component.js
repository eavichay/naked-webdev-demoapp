export class Component extends HTMLElement {

  static template = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = this.constructor.template;
    this.$ = new Proxy({}, {
      get: ({ }, id) => this.shadowRoot.querySelector('#' + id)
    })
    this.render();
  }
}