/******************
Pager
*******************/

var Pager = function(parent_node, paginate_callback) {

	var
		mode = 'css',
		parent_width = parent_node.width(),
		parent_height = parent_node.height(),

		page_container = $('<div class="pages-container" />')
					.appendTo(parent_node)
					.height( parent_height )
					.width( parent_width ),

		page_wrapper = $('<div class="pages-wrapper" />')
					.appendTo( page_container )
					.height( parent_height ),
		total_pages = 0,
		current_page_index = -1,
		pages = [],
		isMoving = false;

	parent_node.on('swipeleft', function(e) {
		e.preventDefault();

		moveForward();

		return false;
	});

	parent_node.on('swiperight', function(e) {
		e.preventDefault();

		moveBackward();

		return false;
	});


	/* ABS/CSS technique */
	function move2(direction) {
		if (isMoving) {
			return;
		}

		var
			current_page = $('.current-page'),
			current_page_number = parseInt(current_page.attr('data-pagenumber'), 10),
			new_page_number = 0;
			new_page = null;
			new_left_position = 0;


		switch (direction) {
			case 'forward':

				if (current_page_number == pages.length)
					return;

				new_page_number = current_page_number+1;
				new_page = current_page.next();

				break;

			case 'back':

				if (current_page_number == 1)
					return;

				new_page_number = current_page_number-1;
				new_page = current_page.prev();

				break;
		}



		// calculate movement
		new_left_position = -(new_page_number-1) * parent_width;

		console.log('move', direction, new_page_number, new_left_position);

		isMoving = true;

		// do movement
		switch (mode) {
			case 'css':
				page_wrapper
					.addClass('pages-transition')
					.css('transform', 'translateX(' + new_left_position + 'px)');

				setTimeout(function() {
					isMoving = false;
				}, 300);

				break;

			case 'scroll':
				page_container.animate({'scrollLeft': new_left_position },
					{
						duration: 300,
						complete: function() {
							isMoving = false;
						}
					});

				break;

			case 'abs':


				page_wrapper.animate({'left': new_left_position },
					{
						duration: 300,
						complete: function() {
							isMoving = false;
						}
					});

				break;
		}



		// reset classes
		current_page
			.removeClass('current-page');

		new_page
				.addClass('current-page');

		// send event info
		if (paginate_callback) {
			paginate_callback( $('.current-page') );
		}


	}

	// single page
	function move(direction) {
		if (isMoving) {
			return;
		}

		var
			current_page = $('.current-page'),
			current_page_number = parseInt(current_page.attr('data-pagenumber'), 10),
			new_page_number = 0,
			new_page = null;

		console.log('direction', current_page_number, pages.length);


		switch (direction) {
			case 'forward':

				if (current_page_number == pages.length)
					return;

				new_page_number = current_page_number+1;
				new_page = pages[new_page_number-1];

				console.log('appending', new_page);

				isMoving = true;


				// move in

				// CSS3 1
				/*
				new_page
					.appendTo(page_wrapper)
					// move off to the side
					//.removeClass('pages-transition')
					.css('left', parent_width + 'px')
					//.css('transform', 'translateX(' + parent_width + 'px)')
					// animate into place
					.addClass('pages-transition')
					//.css('transform', 'translateX(0px)')
					.css('transform', 'translateX(-' + parent_width + 'px)');
	// move out
				current_page
					.addClass('pages-transition')
					.css('transform', 'translateX(-' + parent_width + 'px)');


				*/

				// CSS3 2
				/*
				new_page
					.appendTo(page_wrapper)
					.css('left', parent_width + 'px')
					.transition({
						'x':'-' + parent_width + 'px',
						duration: 300
					});

				current_page
					.css('left', '0')
					.transition({
						'x':'-' + parent_width + 'px',
						duration: 300,
						complete: function() {
							isMoving = false;
							current_page.remove();
						}
					});
				*/

				new_page
					//.appendTo(page_wrapper)
					.css('left', parent_width + 'px')
					.show()
					.animate(
						{'left':'0px'},
						{
							duration: 300,
							complete: function() {
								new_page.show();
							}
						}
					);

				current_page
					.css('left', '0')
					.animate(
						{'left':'-' + parent_width + 'px'},
						{
							duration: 300,
							complete: function() {

								isMoving = false;
								current_page.hide();
							}
						}
					);


				break;

			case 'back':

				if (current_page_number == 1)
					return;

				new_page_number = current_page_number-1;
				new_page = pages[new_page_number-1];

				console.log('appending', new_page);

				isMoving = true;

				// move into place

				// CSS3 1
				/*
				new_page
					.appendTo(page_wrapper)
					.css('left', '-' + parent_width + 'px')
					.transition({
						'x':'' + parent_width + 'px',
						duration: 300
					});

				current_page
					.transition({
						'x':'' + parent_width + 'px',
						duration: 300,
						complete: function() {
							isMoving = false;
							current_page.remove();
						}
					})*/


				new_page
					//.appendTo(page_wrapper)
					.css('left', '-' + parent_width + 'px')
					.show()
					.animate(
						{'left':'0px'},
						{
							duration: 300,
							complete: function() {
								new_page.show();
							}
						}
					);

				current_page
					.animate(
						{'left':'' + parent_width + 'px'},
						{
							duration: 300,
							complete: function() {
								isMoving = false;
								current_page.hide();
							}
						}
					);

				break;
		}

		// reset classes
		current_page
			.removeClass('current-page');

		new_page
				.addClass('current-page');

		// send event info
		if (paginate_callback) {
			paginate_callback( $('.current-page') );
		}
	}

	function moveForward() {
		move('forward');
	}
	function moveBackward() {
		move('back');
	}

	function getLastPage() {
		return page_wrapper.find('.page:last');
	}

	function getCurrentPage() {
		return page_wrapper.find('.current-page');
	}

	function addPage() {


		var page = $('<div class="page" data-pagenumber="' + (pages.length+1) + '" />')
					.appendTo(page_wrapper)
					.css({
						'left': parent_width + 'px',
						'position': 'absolute',
						'width': parent_width
					});

		pages.push(page);

		return page;
	}


	function addContentToPage(page_wrapper, page, content) {

		var max_height = page_wrapper.height();

		// try adding the block
		page.append(content);

		if (page.outerHeight(true) > page_wrapper.height() ) {

			// split the node
			content.remove();
			splitContent(page, content, max_height);

			// create a new page for the remaining content
			if (content.children().length > 0 && page_wrapper.find('.page').length < 20) {

				var page_number = page.parent().find('.page').length+1;

				// new page
				page = addPage();

				addContentToPage(page_wrapper, page, content);
			}
		}

		// DONE
		//page_wrapper.width( parent_node.width() * page_wrapper.find('.page').length );

		// remove all but this one
		//page_wrapper.find('.page:first').siblings().hide();
		current_page_index = 0;
	}

	function splitContent(container, content, max_height) {
		var
			newNode = //$('<' + content[0].tagName + ' />')
						//content.clone()
						$( content[0].cloneNode() )
							.addClass(content[0].className)
							.addClass('split-end')
							.appendTo(container),
			too_big = false,
			loops = 1;

		content.addClass('split-first');

		while (content[0].childNodes.length > 0 && loops < 1000) {
			loops ++;

			var child = content[0].childNodes[0];

			//console.log('checking', child);

			if (child.nodeType === 1) {

				var copy = child.cloneNode(true);

				newNode[0].appendChild(copy);

				var page_height = newNode.closest('.page').outerHeight(true);

				//console.log('checking size', copy, page_height, max_height);

				if (page_height > max_height) {


					// remove the too large one
					newNode[0].removeChild(copy);

					// split again if this one has child nodes
					if ($(copy).children().length > 0) {
						splitContent(newNode, $(child), max_height);
					}

					break;
				} else {
					// so this one fits, means we need to remove it from the content
					content[0].removeChild(child);
				}
			} else if (child.nodeType === 3) {

				// try to split text node?
				var text = child.nodeValue,
					text_parts = text.split(' '),
					text_node = document.createTextNode(child.nodeValue),
					finished_text = false;



				// just add the node
				newNode[0].appendChild(text_node);

				var page_height = newNode.closest('.page').outerHeight(true);

				if (page_height > max_height) {

					text_node.nodeValue = '';

					for (var i=0; i<text_parts.length; i++) {
						text_node.nodeValue += ' ' + text_parts[i];

						page_height = newNode.closest('.page').outerHeight(true);

						if (page_height > max_height) {

							// only add up to the word before
							text_node.nodeValue = text_parts.slice(0,i-1).join(' ');
							child.nodeValue = text_parts.slice(i-1).join(' ');

							finished_text = true;

							break;
						}
					}



					if (finished_text) {
						break;
					}


				} else {
					// it worked, move on
					content[0].removeChild(child);
				}
			} else {
				// what about junk nodes?
			}
		}

		return content;
	}


	function addContent(content) {
		// get the last page
		var page = getLastPage();

		if (page.length == 0) {
			page = addPage();
			page.addClass('current-page').css({'left':'0'});
		}

		addContentToPage(page_wrapper, page, content);
	}

	function clearContent() {
		page_wrapper.children().remove();
		switch (mode) {
			case 'css':
				page_wrapper
					.removeClass('pages-transition')
					//.css('transform', 'translateX(0)');

				break;
			case 'abs':
				page_wrapper.css('left',0);;
				break;
			case 'scroll':
				page_wrapper.scrollLeft(0);
				break;
		}
		pages = [];
		current_page_index = -1;
	}

	function getCurrentPageNumber() {
		return parseInt(page_wrapper.find('.current-page').attr('data-pagenumber'), 10);
	}

	function getTotalPages() {
		return pages.length;
	}


	return {
		add: addContent,
		clear: clearContent,
		moveForward: moveForward,
		moveBackward: moveBackward,
		getCurrentPage: getCurrentPage,
		getCurrentPageNumber: getCurrentPageNumber,
		getTotalPages: getTotalPages
	}


};
