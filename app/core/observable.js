import { Pubsub } from './pubsub.js';

const handlerMap = new WeakSet();

const handler = (target, pubsub, root = '') => {
  if (typeof target === 'object' && target && !handlerMap.has(target)) {
    const proxy = new Proxy(target, {
      set: (target, key, value) => {
        target[key] = handler(value, pubsub, root + '.' + key);
        pubsub.broadcast(root + '.' + key, target[key]);
        return true;
      }
    });
    handlerMap.add(proxy);
    Object.keys(target).forEach(key => {
      target[key] = handler(target[key], pubsub, root + '.' + key);
      pubsub.broadcast(root + '.' + key, target[key]);
    });
    return proxy;
  }
  return target;
}

export const observable = () => {
  const pubsub = new Pubsub();
  return {
    value: handler({}, pubsub, ''),
    watch: pubsub.on.bind(pubsub)
  }
};