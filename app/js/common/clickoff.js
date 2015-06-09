var ClickOff = {
	
	clickTargets:[],
	
	getClickTargets: function() {
		return this.clickTargets;	
	},
	
	setClickTargets: function(clickTargets) {
		this.clickTargets = clickTargets;
		this.clearOffClickTimer();	
	},
	
	docClick: function(e) {
		
		var target = $(e.target),
			clickedOnThis = false;
		
		// go through all nested clicked elements
		while (target != null && target.length > 0) {

			for (var i=0, il=this.clickTargets.length; i<il; i++) {
				var clickTarget = this.clickTargets[i];
				
				if (target[0] == clickTarget[0]) {
					clickedOnThis = true;
					break;					
				}
			}
			
			if (clickedOnThis) {
				break;
			}

			target = target.parent();
		}
		
		console.log('docClick', clickedOnThis, this.clickTargets);
		
		if (!clickedOnThis) {
			e.preventDefault();

			this.startOffClickTimer();
			
			//$(document).off('click', this.docClick);
			this.unbindDocClick();

			return false;
		}
	},
	offClickTimeout: null,
	
	startOffClickTimer: function () {
		var t = this;
		
		this.clearOffClickTimer();		
		this.offClickTimeout = setTimeout(function() {
			if (t.trigger) {
				t.trigger('offclick');
			}				
		}, 50);
	},
	
	clearOffClickTimer: function () {
		if (this.offClickTimeout != null) {
			clearTimeout(this.offClickTimeout);
			this.offClickTimeout = null;			
		}
	},
	
	onshow: function() {
		console.log('clickoff', 'onshow');
	
		this.bindDocClick();
	},

	onhide: function() {
		this.clearOffClickTimer();
		this.unbindDocClick();
	},
	
	bindDocClick: function() {
		$(document).on('click', $.proxy( this, 'docClick' ));
	},
	
	unbindDocClick: function() {
		$(document).off('click', this.docClick);
	}
	
}