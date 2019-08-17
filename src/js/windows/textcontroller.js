//import { Dispatcher } from '../core/dispatcher.js'

class TextController extends Dispatcher {
    constructor(id, window, data) {
        super();

        this.id = id;    
        this.window = window;
        this.data = data;
        this.textid = this.data.textid;
        this.sectionid = this.data.sectionid;

        this.createNodes();        

        // first time load of text information and chapter
        if (this.textid) {

            this.loading.show();

            textLoader.getTextInfo(this.textid, (textInfo) => {
                this.textInfo = textInfo;

                if (this.sectionid) {
                    this.navigate(this.sectionid);
                }
            });
        } 
    }

    createNodes() {

        this.createHeader();
        this.createBody();
        this.createNavs();
    }

    createHeader() {
        // TODO: not use <select>, create UI
        //this.textchooser = new TextChooser(this);   
        //this.textnavigator = new TextNavigator(this);
        
        // verse reference input
        this.input = $(`<div class="sofia-text-chooser"><input class="sofia-header-input" type="text"></div>`)
            .appendTo(this.window.header)
            .find('input');

        this.input.on('keydown', (e) => {            
            if (e.keyCode == 13) {
                let value = this.input.val(),
                    bibleRef = new BibleReference(value);       
                
                if (bibleRef.isValid()) {
                    this.navigate(bibleRef);
                }  
            }
        }); 

        // version list
        this.list = $(`<div class="sofia-text-chooser"><select class="sofia-header-input" type="text"><option>${this.textid}</option></select>`)
            .appendTo(this.window.header)
            .find('select')
            .on('change', (e) => {
                let newTextId = this.list.val();
                this.setText(newTextId);
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
            // for (let textInfo of texts) {
            //     options += `<option value="${textInfo.providerid}">${textInfo.abbr} - ${textInfo.name}</option>`;
            // }
            this.list.html(options);
            this.list.val(this.textid);
        });
    }

    createBody() {
        this.scroller = $(`<div class="sofia-text-controller-container"><div class="sofia-text-controller-padding"></div></div>`)
                            .appendTo(this.window.body);  

        this.content = this.scroller.find('div');                                
    }


    createNavs() { 
        this.prevBtn = $(`<a class="sofia-text-controller-prev"></a>`)
                            .appendTo(this.window.body)
                            .on('click', () => this.prev());      

        this.nextBtn = $(`<a class="sofia-text-controller-next"></a>`)
                            .appendTo(this.window.body)
                            .on('click', () => this.next());   
                            
        this.loading = $(`<div class="sofia-text-controller-loading"></div>`)
                            .appendTo(this.window.body)                                                        

    }    

    setText(textid) {
        this.textid = textid;
        this.list.val(this.textid);
        this.navigate(this.sectionid);
    }   

    setInput(bibleRef) {
        let formattedReference = bibleRef.toString();

        this.input.val(formattedReference);
    }

    loadText(bibleRef) {

        let chapterCode = bibleRef.toChapterCode();

        textLoader.loadSection(this.textid, chapterCode, (chapterNode) => {
            this.content.empty();
            this.content.append( chapterNode );  
            this.scroller.scrollTop(0);

            this.loading.hide();

            this.sectionid = chapterCode;
            this.setInput(bibleRef);
        });
    }

    prev() {
        let previd = this.content.find('.chapter').attr('data-previd'),
            parts = previd.split('_'),
            bibleRef = new BibleReference(parts[0], parts[1]);
        this.navigate(bibleRef);
    }

    next() {
        let nextid = this.content.find('.chapter').attr('data-nextid'),
            parts = nextid.split('_'),
            bibleRef = new BibleReference(parts[0], parts[1]);
        this.navigate(bibleRef);
    }

    navigate(bibleRef) {
        if (bibleRef instanceof BibleReference) {        
            this.loadText(bibleRef);

        } else if (typeof bibleRef == 'string') {
            let newRef = new BibleReference(bibleRef);
            this.navigate(newRef);
        }
    } 
}

//export { TextController }