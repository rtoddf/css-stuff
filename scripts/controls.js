var feedUrl = "http://oom-cmg.streamguys1.com/tam1055/tam1055.mp3"

$(document).ready(function(){
    var v = document.getElementsByTagName('audio')[0];
    
    if(!isMobile.any()) {
        v.oncanplay = function() {
            // set the play control to pause because of autoplay
            $('.listen-live-player #play').toggleClass('fa-pause-circle-o');
            
            // set initial volume .5
            v.volume = .5;
        };
    }

    if(isMobile.any()) {
        $('.listen-live-player .player-controls .player-volume-controls').addClass('mobile')
        $('.listen-live-player .player-controls .control.play-pause').addClass('mobile')
    }

    // play and pause controls
    $('.player-image img, #play').on('click', function(){
        playnpause()
    });
    
    // volume controls
    $('#volume').on('change textInput input', function(){
        v.volume = this.value/100;
    });
    
    function playnpause(){
        $('.listen-live-player #play i').toggleClass('fa-pause-circle-o');
        if (v.paused) {
            v.play();
        } else {
            v.pause();
        }
    }
})

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};