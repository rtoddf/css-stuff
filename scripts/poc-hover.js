var n=0;

$('.deep-dive-hover a').on('click', function(){
	event.preventDefault();
	if(n == 0){
		$(this).parent().find('.bubble').fadeIn();
		n++
	} else {
		window.location.href = $(this).attr('href');
	}
})

$('.deep-dive-hover a').on('mouseover', function(){
	$(this).parent().find('.bubble').fadeIn();
})

$('.deep-dive-hover a').on('mouseout', function(){
	$('.bubble').fadeOut();
})