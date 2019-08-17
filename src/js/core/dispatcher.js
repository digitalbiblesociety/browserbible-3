/**
 * Used by {Dispatcher} to store and fire events
 */
class DispatcherEvent {
    constructor(eventName) {
        this.eventName = eventName;
        this.callbacks = [];
    }

    registerCallback(callback) {
        this.callbacks.push(callback);
    }

    unregisterCallback(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }

    fire(data) {
        const callbacks = this.callbacks.slice(0);
        callbacks.forEach((callback) => {
            callback(data);
        });
    }
}

/**
 * Core class that allows .on() style events to be passed between object
 * like {@link Window}s and other plugins
 */
class Dispatcher {
    constructor() {
        this.events = {};
    }

    clearListeners() {
        // TODO
    }

    /**
     * Fires an event which calls all callback methods
     * @param {string} eventName name of event
     * @param {object} data information sent to the callback function
     */
    trigger(eventName, data) {
        const event = this.events[eventName];
        if (event) {
            event.fire(data);
        }
    }

    /**
     * Like addEventListener
     * @param {string} eventName name of event
     * @param {function} callback method to call when event is triggered
     */
    on(eventName, callback) {
        let event = this.events[eventName];
        if (!event) {
            event = new DispatcherEvent(eventName);
            this.events[eventName] = event;
        }
        event.registerCallback(callback);
    }

    /**
     * Like removeEventListener
     * @param {string} eventName name of event
     * @param {function} callback method to call when event is triggered
     */    
    off(eventName, callback) {
        const event = this.events[eventName];
        if (event && event.callbacks.indexOf(callback) > -1) {
            event.unregisterCallback(callback);
            if (event.callbacks.length === 0) {
                delete this.events[eventName];
            }
        }
    }
}

// export { Dispatcher }