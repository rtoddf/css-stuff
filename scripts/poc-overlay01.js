$(document).ready(function(){
    $('.show-details').on('click', function(){
        $(this).closest('.flex-item').find('.tile').addClass('hover')
    })

    $('.hide-details').on('click', function(){
        $(this).closest('.flex-item').find('.tile').removeClass('hover')
    })
});