var init = function() {
	var box = document.querySelector('#cube'),
		panelClassName = 'show-front',
		buttons = document.querySelector('#show-buttons')

		buttons.querySelectorAll('button').forEach((item) => {
			item.addEventListener('click', (event) => {
				box.classList.remove( panelClassName );
				panelClassName = event.target.className;
				box.classList.add( panelClassName );
			});
		})
	
	document.querySelector('#toggle-backface-visibility').addEventListener('click', function(){
		box.classList.toggle('panels-backface-invisible');
	});
	
};
	
window.addEventListener( 'DOMContentLoaded', init, false);