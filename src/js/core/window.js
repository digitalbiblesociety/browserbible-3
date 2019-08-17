//import { Dispatcher } from './dispatcher.js'
//import { TextController } from '../windows/TextController.js'

/**
 * Creates the outer DOM node structure for an interactive window
 * @param {string} id a unique ID for the {Window} and the outer DOM node
 * @param {Zetpo} parentNode the body of the overall {App}
 * @param {class} controllerClass what will power the window
 * @param {object} data inital settings to pass to the controller class
 * @param {WindowManager} manager a reference to the parent manager
 */	
class Window extends Dispatcher {
    constructor(id, parentNode, controllerClass, data, manager) {
        super();

        this.id = id;
        this.parentNode = parentNode;   
        this.controllerClass = controllerClass;        
        this.data = data;
        this.manager = manager;  

        this.createNodes();
        this.createController();
        this.setupEvents();
    }

    /**
     * Creates a header, main body, close button, and mobile tab
     */
    createNodes() {
        
        // Main, outer node
        this.node = $(`<div class="sofia-window active" data-id="${this.id}"></div>`).appendTo(this.parentNode);

        // header and body
        this.header = $(`<div class="sofia-window-header"></div>`).appendTo(this.node);
        this.body = $(`<div class="sofia-window-body"></div>`).appendTo(this.node);

        // buttons
        this.closeBtn = $(`<div class="sofia-window-close-container"><span class="sofia-window-close-button"></span></div>`)
		 			.appendTo(this.node)
		 			.find('.sofia-window-close-button')
					.on('click', (e) => {                        
                        this.manager.removeWindow(this.id);
                    });

        this.tab = $(`<div class="sofia-window-tab active">
                        <div class="sofia-window-tab-inner">
                            <span class="sofia-window-tab-label-tab">Tab</span>
                        </div>
                    </div>`).appendTo( $('body') );

        // make sure this one is selected
        this.node.siblings('.sofia-window').removeClass('active');
        this.tab.siblings('.sofia-window-tab').removeClass('active');   
        
        // back reference to object
        this.node[0].sofiaWindow = this;        
    }

    /**
     * Instantiates the inner controller and sets up event pass throughts
     */
    createController() {

        if (typeof this.controllerClass != 'undefined') {
            this.controller = new this.controllerClass(this.id, this, this.data);             
        
            // send events up to the manager, up to the app
            this.controller.on('settingschange', (e) => {
                this.trigger('settingschange', e); // {type: e.type, target: this, data: e.data});
            });
            this.controller.on('globalmessage', (e) => {
                e.id = id;
                this.trigger('globalmessage', e); // {type: e.type, target: this, data: e.data});
            });
        }
    }

    /**
     * Handles focus/blur events for the window
     */
    setupEvents() {
        // send focus/blur events down to controller
        this.node.on('mouseenter touchstart', (e) => {
            if (this.controller) {
                this.controller.trigger('focus', {});
            }
            
            this.node
                .addClass('focused')
                .siblings()
                    .removeClass('focused')
                    .trigger('windowblur');
        });

        this.node.on('mouseleave windowblur', (e) => {
            if (this.controller) {
                this.controller.trigger('blur', {});
            }  

            this.node
                .removeClass('focused');    
        });

        this.tab.on('click', (e) => {
            // dectivate all other tabs and windows
            $('.window, .window-tab').removeClass('active');

            this.tab.addClass('active');
            this.node.addClass('active');
        });        
    }
    
    /**
     * Removes nodes and events
     */
	close() {

		if (typeof this.controller.close != 'undefined') {
			this.controller.close();
		}
		this.controller = null;

		this.clearListeners();

		this.tab.remove();
		this.node.remove();
	}    
}

// export { Window }