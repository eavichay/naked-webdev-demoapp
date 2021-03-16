class Pubsub extends EventTarget {

  /**
   * Subscribes to message
   * @param {string} event 
   * @param {CallableFunction} callback 
   * @returns {Function} Unsubscriber
   */
  on(event, callback) {
    const handler = (event) => callback(event.detail);
    this.addEventListener(event, handler);
    return () => this.removeEventListener(event, handler);
  }

  /**
   * Broadcast message with optional payload to all subscribers
   * @param {string} event 
   * @param {any} payload 
   */
  broadcast(event, payload) {
    this.dispatchEvent(new CustomEvent(event, { detail: payload }));
    if (this.DEBUG) {
      console.log(event, payload);
    }
  }
}

export {
  Pubsub
};