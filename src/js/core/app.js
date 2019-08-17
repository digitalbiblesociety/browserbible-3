/**
 * Core application logic that passes commands from the {MainMenu} to the {WindowManager} and child {Window objects}
 */
class SofiaApp extends Dispatcher {
    constructor() {
        super();

        // load app and user settings
        this.appSettings = {};
        this.userSettings = {};
        this.plugins = [];

        // create main HTML
        this.createNodes();

        // add components
        this.windowManager = new WindowManager(this.main, this);
        this.mainMenu = new MainMenu(this.header, this);
    }

    /**
     * Creates the main container node, plus header, main, and footer nodes
     */
    createNodes() {
        
        this.root = $(`#sofia-root`);
        if (this.root.length == 0) {
            this.root = $('body');
        }

		this.container = $(`<div class="sofia-container"></div>`).appendTo(this.root);
		this.header = $(`<div class="sofia-header"></div>`).appendTo(this.container);
		this.main = $(`<div class="sofia-main"></div>`).appendTo(this.container);
		this.footer = $(`<div class="sofia-footer"></div>`).appendTo(this.container);
    }

    /**
     * Manually add a {Window} object
     * @param {class} controllerClass The type of window
     * @param {object} data Initialization settings for window
     */
    addWindow(controllerClass, data) {
        this.windowManager.addWindow(controllerClass, data);
    }

    /**
     * Manually add a {Window} object
     * @param {class} controllerClass The type of window
     * @param {object} data Initialization settings for window
     */
    addPlugin(controllerClass, data) {
        this.plugins.push(new controllerClass(this, data));
    }    
}

//export { App };