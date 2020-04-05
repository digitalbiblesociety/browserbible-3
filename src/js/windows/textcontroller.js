class TextWindow extends Window {
    constructor(id, parentNode, data, manager) {
        super(id, parentNode, data, manager);

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
        this.textViewer = new TextViewerInfinite(this);

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
        this.manager.app.trigger('textnavigate', {fragmentid: this.fragmentid});
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
    constructor(window) {
        super();

        this.window = window;

        this.createNodes();
    }

    createNodes() {
                // verse reference input
        this.input = $(`<div class="sofia-text-chooser"><input class="sofia-header-input" type="text"></div>`)
            .appendTo(this.window.header)
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
    constructor(window, textid) {
        super();

        this.window = window;
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
            .appendTo(this.window.header)
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
    constructor(window) {
        super();

        this.window = window;

        this.createNodes();
    }

    createNodes() {
        this.scroller = $(`<div class="sofia-text-controller-container"><div class="sofia-text-controller-padding"></div></div>`)
                            .appendTo(this.window.body);  

        this.content = this.scroller.find('div');  
        
        this.scroller.on('scroll', (e) => this.onScrollerScroll(e) );

        this.prevBtn = $(`<a class="sofia-text-controller-prev"></a>`)
                            .appendTo(this.window.body)
                            .on('click', () => this.prev());      

        this.nextBtn = $(`<a class="sofia-text-controller-next"></a>`)
                            .appendTo(this.window.body)
                            .on('click', () => this.next());   
                            
        this.loading = $(`<div class="sofia-text-controller-loading"></div>`)
                            .appendTo(this.window.body);
                            
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

        textLoader.loadSection(this.window.textid, chapterCode, (chapterNode) => {
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
    
            this.window.fragmentid = fragmentid;        
        });
    }   
}

class TextViewerInfinite extends Dispatcher{
    constructor(window) {
        super();

        this.window = window;

        this.ignoreScrollEvent = false;
        this.speedLastPos = null;
        this.speedDelta = 0;
        this.speedInterval = null;       

        this.createNodes();
    }

    createNodes() {
        this.scroller = $(`<div class="sofia-text-controller-container"><div class="sofia-text-controller-padding"></div></div>`)
                            .appendTo(this.window.body);  

        this.content = this.scroller.find('div');  
        
        this.scroller.on('scroll', (e) => this.onScrollerScroll(e) );
                            
        this.loading = $(`<div class="sofia-text-controller-loading"></div>`)
                            .appendTo(this.window.body);
                            
        this.on('textloading', () => { this.loading.show(); });
        this.on('textloaded', () => { this.loading.hide(); });
    }

    onScrollerScroll(e) {
        // find place
        let fragmentid = this.getFragment();

        if (!this.ignoreScrollEvent) {
            this.trigger('textscroll', {fragmentid: fragmentid});
        }

        this.startSpeedTest();
    }

    startSpeedTest() {
		if (this.speedInterval == null) {
			this.speedInterval = setInterval(() => this.checkSpeed(), 100);
		}
	}
	
	stopSpeedTest() {
		if (this.speedInterval != null) {
			clearInterval(this.speedInterval);
			this.speedInterval = null;
		}
	}
	
	checkSpeed() {			
		let speedNewPos = this.scroller.scrollTop();
		if (this.speedLastPos != null ) {
			this.speedDelta = speedNewPos - this.speedLastPos;
		}
		this.speedLastPos = speedNewPos;
		
		if (this.speedDelta === 0) {
			this.loadMore();
			this.stopSpeedTest();			
		}
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

        return fragmentid;
    }

    fragmentToSection(fragmentid) {
        let parts = fragmentid.split('_'),
            sectionid = parts[0] + '_' + parts[1];
        
        return sectionid;
    }

    navigate(fragmentid) {
        let chapterCode = this.fragmentToSection(fragmentid);
        this.load(chapterCode, fragmentid, 'text');
    }

    load(sectionid, fragmentid, method) {
    
        console.log('request', sectionid, method);




        this.trigger('textloading', {fragmentid: fragmentid});

        textLoader.loadSection(this.window.textid, sectionid, (chapterHtml) => {
            
            console.log('loaded', sectionid, method);

            // while inserting text
            this.ignoreScrollEvent = true;

            let chapterNode = $(chapterHtml);

            switch (method) {
                default:
                case 'text':

                    this.content.empty();
                    this.content.append( chapterNode );  
                    this.scrollTo(fragmentid);

                    break;

                case 'after':
                    
                    this.content.append( chapterNode );  
                    //this.scrollTo(fragmentid);

                    break; 
                    
                case 'before':

                    let	scrollerTopBefore = this.scroller.scrollTop(),
                        contentHeightBefore = this.content.height(),
                        contentHeightAfter = null;                    

                    this.content.append(chapterNode);
                    contentHeightAfter = this.content.height();                    
                    this.content.prepend(chapterNode);

                    var heightDifference = contentHeightAfter - contentHeightBefore,
                        newScrollerTop = scrollerTopBefore + heightDifference;

                    this.scroller.scrollTop( Math.abs(newScrollerTop ));

                    //this.scrollTo(fragmentid);

                    break;                     
            }

            this.ignoreScrollEvent = false;

            this.trigger('textloaded', {fragmentid: fragmentid});
    
            this.window.fragmentid = fragmentid; 
            
            //this.loadMore();
            this.startSpeedTest();
        });
    } 
    
    scrollTo(fragmentid) {
        if (fragmentid == '') {
            return;
        }

        let contentAreaTop = this.content.offset().top,
            verseNode = this.content.find(`[data-id="${fragmentid}"]`),
            verseNodeTop = verseNode.offset().top;
        
        this.ignoreScrollEvent = true;
        this.scroller.scrollTop(verseNodeTop - contentAreaTop);        
        this.ignoreScrollEvent = false;
    }

    loadMore() {
        
        // measure top and bottom height
		let
			sectionid = null,
			contentHeight = this.content.height(),
			scrollerHeight = this.scroller.height(),
            scrollerScrollTop = this.scroller.scrollTop(),
            aboveTop = scrollerScrollTop,
			sections = this.content.find( '.section' ),
			sectionsCount = sections.length,			
            belowBottom = contentHeight - scrollerHeight - scrollerScrollTop;

		// only load if stopped
		if (this.speedDelta == 0) {
			
			// add below
			if (belowBottom < scrollerHeight*2) {
                
                // the last chapter (bottom)
				sectionid = sections.last().attr( 'data-nextid' );
	
				if (sectionid != null && sectionid != 'null' && sections.length < 50) {
					this.load(sectionid, sectionid, 'after');
				}
			}
	
			// add above
			else if (aboveTop < scrollerHeight*2) {
                
                // the first chapter (top)
				sectionid = sections.first().attr( 'data-previd' );
	
				if (sectionid != null && sectionid != 'null' && sections.length < 50) {
					this.load(sectionid, sectionid, 'before');
				}
			}

			// remove above
			else if (aboveTop > scrollerHeight*15) {
				
				if (sectionsCount >= 2) {
	
					// we're removing the first section, so we need to find the second one and
					// measure where its first child should appear
					let first_node_of_second_section = sections.eq(1).children().first(),
						first_node_offset_before = first_node_of_second_section.offset().top;
	
                    sections.first().remove();
	
					// remeasure where the first node appears and adjust the scrolltop
					let
						first_node_offset_after = first_node_of_second_section.offset().top,
						offset_difference = first_node_offset_after - first_node_offset_before,
						new_scrolltop = this.scroller.scrollTop(),
						updated_scrolltop = new_scrolltop - Math.abs(offset_difference);
	
					this.scroller.scrollTop(updated_scrolltop);
				}
			}
			
			// remove below
			else if (sectionsCount > 4 && belowBottom > scrollerHeight*15) {
				this.content.find('.section').last().remove();
			}
		}
    }
}