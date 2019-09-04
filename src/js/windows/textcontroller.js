class TextController extends Dispatcher {
    constructor(id, window, data) {
        super();

        this.id = id;    
        this.window = window;
        this.data = data;
        this.textid = this.data.textid;
        this.fragmentid = this.data.fragmentid;

        this.createNodes();  
        this.start();      
    }

    start() {

        // first time load of text information and chapter
        if (this.textid) {

            textLoader.getTextInfo(this.textid, (textInfo) => {
                this.textInfo = textInfo;

                if (this.fragmentid) {
                    this.textViewer.navigate(this.fragmentid);
                }
            });
        } 

    }

    createNodes() {
        this.textNavigator = new TextNavigator(this);
        this.textChooser = new TextChooser(this, this.textid);        
        this.textViewer = new TextViewerSingle(this);

        this.textViewer.on('textscroll', (e) => this.onViewerScroll(e));
        this.textViewer.on('textnavigate', (e) => this.onViewerNavigate(e));
        this.textViewer.on('textloaded', (e) => this.onViewerNavigate(e));

        this.textNavigator.on('usernavigate', (e) => this.onUserNavigate(e));
        this.textChooser.on('textchange', (e) => this.onUserTextChange(e));
    }

    onViewerScroll(e) {
        // set input to show new location
        this.fragmentid = e.fragmentid;
        this.textNavigator.setLocation(this.fragmentid);
        // send event up to app
        this.window.manager.app.trigger('textnavigate', {fragmentid: this.fragmentid});
    }

    onViewerNavigate(e) {
        // set input to show new location
        this.fragmentid = e.fragmentid;
        this.textNavigator.setLocation(this.fragmentid);
        // send event up to app    
    }

    onUserNavigate(e) {
        // pass to viewer
        this.textViewer.navigate(e.fragmentid);
    }

    onUserTextChange(e) {
        // pass to viewer
        this.textid = e.textid;
        //this.textViewer.changeText(e.textid);
        this.textViewer.navigate(this.fragmentid);
    }
}

class TextNavigator extends Dispatcher{
    constructor(textController) {
        super();

        this.textController = textController;

        this.createNodes();
    }

    createNodes() {
                // verse reference input
        this.input = $(`<div class="sofia-text-chooser"><input class="sofia-header-input" type="text"></div>`)
            .appendTo(this.textController.window.header)
            .find('input');

        this.input.on('keydown', (e) => {            
            if (e.keyCode == 13) {
                let value = this.input.val(),
                    bibleRef = new BibleReference(value);       
                
                if (bibleRef.isValid()) {
                    this.trigger('usernavigate', { fragmentid: bibleRef.toVerseCode() });
                }
            }
        }); 
    } 

    setLocation(fragmentid) {
        let bibleRef = new BibleReference(fragmentid);

        this.input.val(bibleRef.toString());
    }
}


class TextChooser extends Dispatcher{
    constructor(textController, textid) {
        super();

        this.textController = textController;
        this.textid = textid;

        this.createNodes();
    }

    createNodes() {
        // create version list
        this.list = $(`<div class="sofia-text-chooser">
                            <select class="sofia-header-input" type="text">
                                <option>${this.textid}</option>
                            </select>
                        </div>`)
            .appendTo(this.textController.window.header)
            .find('select')
            .on('change', (e) => {
                let newTextId = this.list.val();
                this.trigger('textchange', {textid: newTextId});
            });

        // load versions
        textLoader.getTextsList( (texts) => {
            let options = '';
            for (let providerInfo of Object.values(textLoader.providers)) {
                options += `<optgroup label="${providerInfo.provider.name}">`;  
                for (let textInfo of providerInfo.provider.textInfoList) {
                    options += `<option value="${textInfo.providerid}">${textInfo.abbr} - ${textInfo.name}</option>`;
                }  

                options += `</optgroup>`;  
            }
            this.list.html(options);
            this.list.val(this.textid);
        });
    } 
}

class TextViewerSingle extends Dispatcher{
    constructor(controller) {
        super();

        this.controller = controller;

        this.createNodes();
    }

    createNodes() {
        this.scroller = $(`<div class="sofia-text-controller-container"><div class="sofia-text-controller-padding"></div></div>`)
                            .appendTo(this.controller.window.body);  

        this.content = this.scroller.find('div');  
        
        this.scroller.on('scroll', (e) => this.onScrollerScroll(e) );

        this.prevBtn = $(`<a class="sofia-text-controller-prev"></a>`)
                            .appendTo(this.controller.window.body)
                            .on('click', () => this.prev());      

        this.nextBtn = $(`<a class="sofia-text-controller-next"></a>`)
                            .appendTo(this.controller.window.body)
                            .on('click', () => this.next());   
                            
        this.loading = $(`<div class="sofia-text-controller-loading"></div>`)
                            .appendTo(this.controller.window.body);
                            
        this.on('textloading', () => { this.loading.show(); });
        this.on('textloaded', () => { this.loading.hide(); });
    }

    onScrollerScroll(e) {
        // find place
        let fragmentid = this.getFragment();

        this.trigger('textscroll', {fragmentid: fragmentid});
    }

    getFragment() {
        let 
            fragmentid = '',
            fragmentSelector = '.v',            
            topOfScroller = this.scroller.offset().top,
            fragments = null;
            
            
        fragments = this.content.find(fragmentSelector);

        fragments.each(function(fragEl) {
            let frag = $(this),
                isFirstVisibleFragment = false;
            
            // is the top of the fragment at the top of the scroll pane
			if (frag.offset().top - topOfScroller > -2) {
                isFirstVisibleFragment = true;
                
                fragmentid = frag.attr('data-id');
                // TODO: check for 
				//let totalFragments = frag.parent().find('.' + fragmentid);
            }

            // when we find it, return false to stop looking
            return !isFirstVisibleFragment;
        });

        // let fragmentid = this.content.find('.v').first().attr('data-id');

        // TODO: detect actual chapter

        return fragmentid;
    }

    prev() {
        let previd = this.content.find('.chapter').attr('data-previd');
            
        this.navigate(previd);
    }

    next() {
        let nextid = this.content.find('.chapter').attr('data-nextid');

        this.navigate(nextid);
    }

    fragmentToSection(fragmentid) {
        let parts = fragmentid.split('_'),
            sectionid = parts[0] + '_' + parts[1];
        
        return sectionid;
    }

    navigate(fragmentid) {

        let chapterCode = this.fragmentToSection(fragmentid);

        this.trigger('textloading', {fragmentid: fragmentid});

        textLoader.loadSection(this.controller.textid, chapterCode, (chapterNode) => {
            this.content.empty();
            this.content.append( chapterNode );  
            //this.scroller.scrollTop(0);

            // scroll to verse: fragmentid
            let contentAreaTop = this.content.offset().top,
                verseNode = this.content.find(`[data-id="${fragmentid}"]`),
                verseNodeTop = verseNode.offset().top;
            
            this.scroller.scrollTop(verseNodeTop - contentAreaTop);
            

            //debugger;

            this.trigger('textloaded', {fragmentid: fragmentid});
    
            this.controller.fragmentid = fragmentid;        
        });
    }   
}