var random_image_number,
    random_image,
    properties

var fade_interval = 3000,
    image_holders = [],
    used_image_holders = [],
    used_properties = []

$(document).ready(function(){
    $('.image-holder').each(function(index, elem) {
        image_holders.push($(elem))
    });

    $.getJSON('data/people.json', function(data){
        properties = data

        image_holders.forEach(function(elem, index){
            random_image_number = 0 + Math.floor(Math.random() * (properties.length - 1));
            random_image = properties[random_image_number]
            fade($(elem), 1000, random_image, 700)
        })
    })    
})

setInterval(function(){
// $('.click').on('click', function(){
    var random_image_holder_number = 0 + Math.floor(Math.random() * (image_holders.length - 1));
    var random_image_holder = image_holders[random_image_holder_number];
    random_image_number = 0 + Math.floor(Math.random() * (properties.length - 1));
    random_image = properties[random_image_number]

    random_image_holder.find('img').fadeOut(700, function() {
        $(this).attr('src', 'images/' + random_image['image']);
        $(this).parent().attr('href', '#');
        $(this).load(function(){
            $(this).fadeIn(900);
        });
    });

    fade(random_image_holder, 700, random_image, 900)

    used_image_holders.push(random_image_holder)
    image_holders.splice($.inArray(random_image_holder, image_holders), 1)

    if(properties.length == 0){
        $.merge(properties, used_properties)
        used_properties.length = 0;
    }

    if(image_holders.length == 0){
        $.merge(image_holders, used_image_holders)
        used_image_holders.length = 0;
    }
// })
    
}, fade_interval);

function fade(random_image_holder, fade_out_speed, random_image, fade_in_speed){
    random_image_holder.find('img').fadeOut(fade_out_speed, function() {
        $(this)
            .attr('src', 'images/' + random_image['image'])
            .attr('alt', random_image['name'])
            .attr('title', random_image['name']);
        $(this).load(function(){
            $(this).fadeIn(fade_in_speed);
        });
    });

    used_properties.push(random_image)
    properties.splice($.inArray(random_image, properties), 1)
}
