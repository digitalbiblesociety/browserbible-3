class InfoWindow extends EventEmitter {
    constructor(id) {
		super(id);
		
		this.createNodes();    
		
		// ext = $.extend(true, ext, ClickOff);
		// ext.setClickTargets([container]);
		// ext.clickoffid = id;
		// ext.on('offclick', function() {
		// 	hide();
		// });
	
    }

    createNodes() {
		this.container = $(	'<div class="info-window"' + (id ? ' id="' + id + '"' : '') + '>'+
							'<span class="close-button"></span>' +
							'<div class="info-body"></div>' +
						'</div>')
							.appendTo( $(document.body) )
							.hide();

		this.body = container.find('.info-body'),
		this.close = container.find('.close-button')		
			.on('click', this.hide);
		
		this.win = $(window);
	}

	show() {
		this.container.show();
		
		this.ext.trigger('show');

		return this;
	}
	hide() {
		this.container.hide();

		//ext.onhide();

		this.trigger('hide');

		return this;
	}

	center() {
		var
			infoWidth = this.container.outerWidth(),
			infoHeight = this.container.outerHeight();

		this.container.css({
			top: this.win.height()/2 - infoHeight/2,
			left: this.win.width()/2 - infoWidth/2
		});

		return this;
	}

	position(target) {
		var tOffset = target.offset(),
			tHeight = target.outerHeight(),
			left = tOffset.left - 20,
			top = tOffset.top + tHeight,
			infoWidth = this.container.outerWidth(),
			infoHeight = this.container.outerHeight();


		// far left edge
		if (left < 0) {
			left = 0;
		// far right
		} else if (left + infoWidth > win.width()) {
			left = win.width() - infoWidth;
		}

		if (top + infoHeight > win.height()) {
			top = tOffset.top - infoHeight;
		}

		this.container.css({
			top: top,
			left: left
		});
		return this;
	}
}