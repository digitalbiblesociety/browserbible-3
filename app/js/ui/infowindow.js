var InfoWindow = function(id) {
	var container = $(	'<div class="info-window"' + (id ? ' id="' + id + '"' : '') + '>'+
							'<span class="close-button"></span>' +
							'<div class="info-body"></div>' +
						'</div>')
							.appendTo( $(document.body) )
							.hide(),

		body = container.find('.info-body'),
		close = container.find('.close-button'),
		win = $(window),
		timerEnabled = true,
		clickOffEnabled = true,
		clickOffNode = null,
		timer = new Timer(hide, 500);

	container
		.on('mouseout', function() {
			if (timerEnabled) {
				timer.start();
			}
		})
		.on('mouseover', function() {
			if (timerEnabled) {
				timer.clear();
			}
		});


	close
		.on('click', hide);


	function show() {
		container.show();

		if (clickOffEnabled) {
			setTimeout(function() {
				$(document).on('click', doc_click);
			});
		}
		ext.trigger('show');

		return ext;
	}
	function hide() {
		container.hide();

		if (clickOffEnabled) {
			$(document).off('click', doc_click);
		}

		ext.trigger('hide');

		return ext;
	}


	function doc_click(e) {

		var target = $(e.target),
			clickedOnWindow = false;

		// go through all nested clicked elements
		while (target != null && target.length > 0) {

			if (target[0] == container[0] || (clickOffNode != null && target[0] == clickOffNode[0]) ) {
				clickedOnWindow = true;
				break;
			}

			target = target.parent();
		}

		//return;
		if (!clickedOnWindow) {
			e.preventDefault();

			hide();

			return false;
		}
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
		center: center,
		clickOffNode: clickOffNode
	};

	ext = $.extend(true, ext, EventEmitter);




	return ext;

};
