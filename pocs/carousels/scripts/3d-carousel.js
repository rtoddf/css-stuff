// https://desandro.github.io/3dtransforms/examples/carousel-02-dynamic.html
// http://www.the-art-of-web.com/css/3d-transforms/

var html = '';

//set up
fetch('./data/slides01.json')
	.then(function (response) {
		return response.json();
	}).then(function (data) {
		data.forEach(function(n){
			html += `
				<figure>
					<div class="image-holder">
						<span class="filler">
							<img src="./images/` + n.image + `" alt="` + n.title + `">
						</span>
					</div>
					<div class="content-holder">
						<h4>` + n.title + `</h4>
					</div>
				</figure>
			`;
		})

		document.querySelector('#carousel').innerHTML = html;
		document.querySelector('#panel-count').setAttribute('max', data.length);
		document.querySelector('#panel-count').setAttribute('value', data.length/2);

		init();
	}).catch(function (err) {
		// There was an error
		console.warn('Something went wrong.', err);
	});

var transformProp = Modernizr.prefixed('transform');

// console.log('transformProp: ', transformProp)

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
		panelCountInput = document.getElementById('panel-count'),
		axisButton = document.getElementById('toggle-axis'),
		currentPanel = 1

	onNavButtonClick = function(event){
		var increment = parseInt( event.target.getAttribute('data-increment') );
		carousel.rotation += carousel.theta * increment * -1;
		carousel.transform();

		if(currentPanel < carousel.panelCount){
			// console.log('if: ', currentPanel)
			currentPanel = currentPanel + increment;
		} else if(currentPanel >= carousel.panelCount){
			// console.log('else if: ', currentPanel)
			currentPanel = 1;
		}
	};

	var navbuttons = document.getElementsByClassName("navigation");
	
	for (var i = 0; i < navbuttons.length; i++) {
		navbuttons[i].addEventListener('click', onNavButtonClick, false);
	}

	// populate on startup
	carousel.panelCount = parseInt(panelCountInput.getAttribute('value'), 10);
	document.querySelector('#num-panels').innerHTML = carousel.panelCount;
	carousel.modify();

	axisButton.addEventListener('click', function(){
		carousel.isHorizontal = !carousel.isHorizontal;
		carousel.modify();
	});

	document.querySelector('#panel-count').addEventListener('change', function(){
		carousel.panelCount = event.target.value;
		document.querySelector('#num-panels').innerHTML = carousel.panelCount;
		carousel.modify();
	});

	setTimeout( function(){ document.querySelector('body').classList.add('ready'); }, 0);

	document.querySelector('#carousel').addEventListener('mousedown', handleTouchStart, false)
	document.querySelector('#carousel').addEventListener('mouseup', handleTouchEnd, false)

	document.addEventListener('keydown', function(e) {
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
		document.querySelector('body').style.cursor = '-webkit-grabbing';
	};

	function handleTouchEnd(e){
		document.querySelector('body').style.cursor = 'auto';
		xUp = e.clientX;
		yUp = e.clientX;
		amountMoved = xDown - xUp

		if(amountMoved > 0){
			increment = parseInt(1);
		} else {
			increment = parseInt(-1);
		}

		carousel.rotation += carousel.theta * increment * -1;
		carousel.transform();
	}
};

// window.addEventListener( 'DOMContentLoaded', init, false);