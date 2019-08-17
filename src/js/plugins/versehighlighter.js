/**
 * Creates the outer DOM node structure for an interactive window
 * @param {SofiaApp} app a reference to the parent app
 * @param {object} data inital settings to pass to the controller class
 */	
class VerseHighlighter extends Dispatcher {
    constructor(app, data) {
        super();

        this.app = app;
        this.data = data;

        // verse over
        app.main.on('mouseover', '.v', (e) => {
            let src = $(e.srcElement),
                verse = src.closest('.v'),
                fragmentid = verse.attr('data-id'),
                matches = $(`.v[data-id="${fragmentid}"]`);
            
            // only when there is a match
            if (matches.length > 1) {
                $(`.v[data-id="${fragmentid}"]`).addClass('v-hover-match');

                verse.addClass('v-hover').removeClass('v-hover-match');
            }
        });

        app.main.on('mouseout mouseleave', '.v', (e) => {
            $(`.v-hover`)
                .removeClass('v-hover');

            $(`.v-hover-match`)
                .removeClass('v-hover-match');                
        });        
    }  
}