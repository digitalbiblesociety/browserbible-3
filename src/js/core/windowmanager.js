// import { Dispatcher } from './dispatcher.js'
// import { Window } from './window.js'

/**
 * Handles multiple {Window} objects, creating, ordering, and destroying them.
 */	
class WindowManager extends Dispatcher {
    constructor(node, app) {
        super();
        
        this.node = node;
        this.app = app;
        this.windows = [];        
    }

    /**
     * Create a new {Window} object
     * @param {class} controllerClass The type of window
     * @param {object} data Initialization settings for window
     */	
	addWindow(controllerClass, data) {

		let id = 'win' + (new Date()).getTime().toString(),
			win = new Window(id, this.node, controllerClass, data, this);

		// create window and add to array
		this.windows.push(win);

		this.makeDraggable(win);
	}

     /**
     * Removes a window and unhooks all its events
     * @param {string} id The unique ID of the window
     */	  
	removeWindow(id) {

		// find window
		const windowsToClose = this.windows.filter((win) => win.id == id),
			windowToClose = (windowsToClose.length == 1) ? windowsToClose[0] : null;

		// remove from array
		this.windows = this.windows.filter((win) => win.id != id);

		//app.PlaceKeeper.storePlace();

		// remove from DOM, run delete functions
		windowToClose.close();
		windowToClose = null;
	
		//app.PlaceKeeper.restorePlace();

		this.windows[0].tab.addClass('active');
		this.windows[0].node.addClass('active');

		setTimeout(function() {
			this.app.resize();
		},10);

        this.dispatch('settingschange', {target: this, data: null});
	}    	

	/**
     * Adds events for {Window}s to be re-orderd by the user
     */	
	makeDraggable(win) {

		// store the window being moved here on the WindowManager
		this.draggingWindow = null;

		// The header portion of each window is the draggable element
		// but it works better on mousedown rather than always
		win.header.on('mousedown', (e) => {
			if ($(e.srcElement).hasClass('sofia-window-header')) {
				win.node.attr('draggable', true);			
				this.draggingWindow = win;
			}
		});
		win.header.on('mouseup', (e) => {			
			win.node.attr('draggable', false);
			this.draggingWindow = null;
		});	

		// events on the Window object's main .node
		win.node.on('dragstart', (e) => {
			win.node.addClass('dragging');
			this.draggingWindow = win;
		});
		win.node.on('dragend', (e) => {
			e.preventDefault();			
			win.node.removeClass('dragging');
		});

		// events on the drop target
		win.node.on('dragover', (e) => {		
			e.preventDefault();
			win.node.addClass('dragover');						
		});

		// move the window on dragenter (rather than 'drop') because it's much more intuitive
		win.node.on('dragenter', (e) => {
			e.preventDefault();
			win.node.addClass('dragover');
			
			let src = $(e.srcElement),
				parentWindowNode = src.closest('.sofia-window'),
				droppedOnWindow = parentWindowNode[0].sofiaWindow;

			if (droppedOnWindow != this.draggingWindow) {
				
				// if dragging is before, then insert after (1 on 2 or 3)
				if (this.draggingWindow.node[0].compareDocumentPosition(droppedOnWindow.node[0]) == Node.DOCUMENT_POSITION_FOLLOWING) {					
					droppedOnWindow.node.after(this.draggingWindow.node);
				} else {
					// if dragging is after, then insert before (3 on 1 or 2)
					droppedOnWindow.node.before(this.draggingWindow.node);
				}

				// TODO: reorder this.windows array
			}			
		});
		win.node.on('dragleave', (e) => {
			e.preventDefault();
			win.node.removeClass('dragover');		
		});		
		win.node.on('drop', (e) => {
			e.preventDefault();
			win.node.removeClass('dragover');
			this.draggingWindow = null;
		});
    }
}

//export { WindowManager };