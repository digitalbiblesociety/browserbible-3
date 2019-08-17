
/**
 * TODO: build out new dropdownmenu
 */
class MainMenu {
    constructor(parentNode, app) {
        this.app = app;
        this.parentNode = parentNode;

        this.createNodes();
    }

    /**
     * Dummy method to allow simple windows for demo
     */
    createNodes() {
        this.addWindowBtn = $(`<div class="sofia-header-button add"></div>`)
            .appendTo(this.parentNode)
            .on('click', (e) => {
                this.app.addWindow(TextController,{textid: 'dbs:ENGESV', sectionid: 'Prov 3:5'});
            });        
    }
}

//export { MainMenu };