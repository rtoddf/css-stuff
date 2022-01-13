// https://desandro.github.io/3dtransforms/examples/carousel-02-dynamic.html
// http://www.the-art-of-web.com/css/3d-transforms/

var transformProp = Modernizr.prefixed('transform');

console.log('transformProp: ', transformProp)

function Carousel3D (el) {
	this.element = el;
	this.rotation = 0;
	this.panelCount = 0;
	this.totalPanelCount = this.element.children.length;
	this.theta = 0;
	this.isHorizontal = true;
}

Carousel3D.prototype.modify = function() {
	var panel, angle, i;

	this.panelSize = this.element[ this.isHorizontal ? 'offsetWidth' : 'offsetHeight' ];
	this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
	this.theta = 360 / this.panelCount;

	// do some trig to figure out how big the carousel
	// is in 3D space
	this.radius = Math.round( ( this.panelSize / 2) / Math.tan( Math.PI / this.panelCount ) );

	for (i = 0; i < this.panelCount; i++) {
		panel = this.element.children[i];
		angle = this.theta * i;
		panel.style.opacity = 1;
		// panel.style.backgroundColor = 'hsla(' + angle + ', 100%, 50%, 0.8)';
		// rotate panel, then push it out in 3D space
		panel.style[ transformProp ] = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
	}

	// hide other panels
	for (  ; i < this.totalPanelCount; i++ ) {
		panel = this.element.children[i];
		panel.style.opacity = 0;
		panel.style[ transformProp ] = 'none';
	}

	// adjust rotation so panels are always flat
	this.rotation = Math.round( this.rotation / this.theta ) * this.theta;
	this.transform();
};

Carousel3D.prototype.transform = function() {
	// push the carousel back in 3D space,
	// and rotate it
	this.element.style[ transformProp ] = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)';
};

var init = function() {
	var carousel = new Carousel3D( document.getElementById('carousel') ),
		panelCountInput = $('#panel-count'),
		axisButton = $('#toggle-axis'),
		currentPanel = 1,

		navButtons = $('#navigation').find('button'),

		onNavButtonClick = function(event){
			$('#carousel figure').removeClass('current-panel')

			var increment = parseInt( event.target.getAttribute('data-increment') );
			carousel.rotation += carousel.theta * increment * -1;
			carousel.transform();

			// console.log('panelCount: ', carousel.panelCount)
			// console.log('currentPanel: ', currentPanel)
			// if(currentPanel < carousel.panelCount && currentPanel > 1){

			if(currentPanel < carousel.panelCount){
				// console.log('if: ', currentPanel)
				currentPanel = currentPanel + increment;
			} else if(currentPanel >= carousel.panelCount){
				// console.log('else if: ', currentPanel)
				currentPanel = 1;
			}
			// else if(currentPanel < 2){
				
			// 	currentPanel = carousel.panelCount;
			// 	currentPanel = currentPanel + increment;

			// 	console.log('last else: ', currentPanel)
			// }

			// console.log('currentPanel: ', currentPanel)

			$('#carousel figure:nth-child(' + currentPanel + ')').addClass('current-panel')
			
		};

	$('#carousel figure:nth-child(' + currentPanel + ')').addClass('current-panel')

	// populate on startup
	carousel.panelCount = parseInt(panelCountInput.attr('value'), 10);
	$('#num-panels').html(carousel.panelCount)
	carousel.modify();

	axisButton.on('click', function(){
		carousel.isHorizontal = !carousel.isHorizontal;
		carousel.modify();
	});

	$('#panel-count').on('change', function(event){
		carousel.panelCount = event.target.value;
		$('#num-panels').html(carousel.panelCount)
		carousel.modify();
	});

	navButtons.on('click', onNavButtonClick);

	$('#toggle-backface-visibility').on( 'click', function(){
		$('#carousel').toggleClass('panels-backface-invisible');
	});

	setTimeout( function(){
		$('body').addClass('ready');
	}, 0);

	$('#carousel').on('mousedown', handleTouchStart)
	$('#carousel').on('mouseup', handleTouchEnd)

	$(document).keydown(function(e) {
	    switch(e.which) {
	        case 37: // left
	        	increment = parseInt(-1);
	        break;

	        case 38: // up
	        	increment = parseInt(-1);
	        break;

	        case 39: // right
	        	increment = parseInt(1);
	        break;

	        case 40: // down
	        	increment = parseInt(1);
	        break;

	        default: return; // exit this handler for other keys
	    }
	    carousel.rotation += carousel.theta * increment * -1;
		carousel.transform();
	    e.preventDefault(); // prevent the default action (scroll / move caret)
	});

	var xDown = null;
	var yDown = null;
	var xUp = null;
	var yUp = null;
	var amountMoved = null;
	var increment;

	function handleTouchStart(e){
		event.preventDefault();
		xDown = e.clientX;
		yDown = e.clientX;
		$(document.body).css({'cursor' : '-webkit-grabbing'});
	};

	function handleTouchEnd(e){
		$(document.body).css({'cursor' : 'auto'});
		xUp = e.clientX;
		yUp = e.clientX;
		amountMoved = xDown - xUp

		if(amountMoved > 0){
			console.log('move left: ', amountMoved)
			increment = parseInt(1);
		} else {
			console.log('move right: ', amountMoved)
			increment = parseInt(-1);
		}

		carousel.rotation += carousel.theta * increment * -1;
		carousel.transform();
	}

};

window.addEventListener( 'DOMContentLoaded', init, false);