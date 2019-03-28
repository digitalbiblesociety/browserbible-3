var InfoWindow = function(id) {
	var container = $(	'<div class="info-window"' + (id ? ' id="' + id + '"' : '') + '>'+
							'<span class="close-button"><svg class="icon"><use xlink:href="' + sofia.config.icons + '#close-button"></use></svg></span>' +
							'<div class="info-body"></div>' +
						'</div>')
							.appendTo( $(document.body) )
							.hide(),

		body = container.find('.info-body'),
		close = container.find('.close-button'),
		win = $(window);

	close
		.on('click', hide);


	function show() {
		container.show();

		ext.onshow();
		ext.trigger('show');

		return ext;
	}
	function hide() {
		container.hide();

		ext.onhide();

		ext.trigger('hide');

		return ext;
	}

	function center() {
		var
			infoWidth = container.outerWidth(),
			infoHeight = container.outerHeight();

		container.css({
			top: win.height()/2 - infoHeight/2,
			left: win.width()/2 - infoWidth/2
		});

		return ext;
	}

	function position(target) {
		var tOffset = target.offset(),
			tHeight = target.outerHeight(),
			left = tOffset.left - 20,
			top = tOffset.top + tHeight,
			infoWidth = container.outerWidth(),
			infoHeight = container.outerHeight();


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

		container.css({
			top: top,
			left: left
		});
		return ext;
	}

	var ext =  {
		show: show,
		hide: hide,
		container: container,
		body: body,
		position: position,
		center: center
	};

	ext = $.extend(true, ext, EventEmitter);
	ext = $.extend(true, ext, ClickOff);
	ext.setClickTargets([container]);
	ext.clickoffid = id;
	ext.on('offclick', function() {
		hide();
	});




	return ext;

};
