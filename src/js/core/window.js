/**
 * Creates the outer DOM node structure for an interactive window
 * @param {string} id a unique ID for the {Window} and the outer DOM node
 * @param {Zetpo} parentNode the body of the overall {App}
 * @param {class} controllerClass what will power the window
 * @param {object} data inital settings to pass to the controller class
 * @param {WindowManager} manager a reference to the parent manager
 */	
class Window extends Dispatcher {
    constructor(id, parentNode, data, manager) {
        super();

        this.id = id;
        this.parentNode = parentNode;        
        this.data = data;
        this.manager = manager;

        this.createFrame();
        this.setupEvents();
    }

    /**
     * Creates a header, main body, close button, and mobile tab
     */
    createFrame() {
        
        // Main, outer node
        this.node = $(`<div class="sofia-window active" data-id="${this.id}"></div>`).appendTo(this.parentNode);

        // header and body
        this.header = $(`<div class="sofia-window-header"></div>`).appendTo(this.node);
        this.body = $(`<div class="sofia-window-body"></div>`).appendTo(this.node);

        // buttons
        this.closeBtn = $(`<div class="sofia-window-close-container"><button class="sofia-window-close-button" type="button"></buton></div>`)
		 			.appendTo(this.header)
		 			.find('.sofia-window-close-button')
					.on('click', (e) => {                        
                        this.manager.removeWindow(this.id);
                    });

        this.tab = $(`<button class="sofia-window-tab active" type="button">
                        <div class="sofia-window-tab-inner">
                            <span class="sofia-window-tab-label-tab">Tab</span>
                        </div>
                    </button>`).appendTo( $('.sofia-windownav') );

        // make sure this one is selected
        this.node.siblings('.sofia-window').removeClass('active');
        this.tab.siblings('.sofia-window-tab').removeClass('active');   
        
        // back reference to object
        this.node[0].sofiaWindow = this;        
    }

   
    /**
     * Handles focus/blur events for the window
     */
    setupEvents() {
        // send focus/blur events down to controller
        this.node.on('mouseenter touchstart', (e) => {
            this.trigger('focus', {});
            
            this.node
                .addClass('focused')
                .siblings()
                    .removeClass('focused')
                    .trigger('windowblur');
        });

        this.node.on('mouseleave blur', (e) => {
            this.trigger('blur', {});
            
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
		this.clearListeners();

		this.tab.remove();
		this.node.remove();
	}    
}