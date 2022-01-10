var init = function() {
	var box = $('#cube'),
		showPanelButtons = $('#show-buttons button'),
		panelClassName = 'show-front',

		onButtonClick = function( event ){
			box.removeClass( panelClassName );
			panelClassName = event.target.className;
			box.addClass( panelClassName );
		};

	for (var i=0, len = showPanelButtons.length; i < len; i++) {
		showPanelButtons[i].addEventListener('click', onButtonClick, false);
	}
	
	$('#toggle-backface-visibility').on('click', function(){
		box.toggleClass('panels-backface-invisible');
	});
	
};
	
window.addEventListener( 'DOMContentLoaded', init, false);