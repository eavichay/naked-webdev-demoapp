/**
 * @type {Record<string, () => any}
 */
const registry = {};

export const register = (name, factory) => {
  if (name in registry)
    throw new Error(`Cannot register ${name}, already taken`);
  registry[name] = factory;
};

const provide = (name, target) => {
  if (name in registry) {
    target[name] = registry[name]();
  }
};

export function DependencyMixin(Base) {
  return class extends Base {
    constructor(...args) {
      super(...args);
      const { inject } = this.constructor;
      this.inject = this.inject || {};
      if (inject) {
        inject.forEach((dep) => provide(dep, this.inject));
        if (typeof this.ready === "function") {
          this.ready();
        }
      }
    }
  };
}
