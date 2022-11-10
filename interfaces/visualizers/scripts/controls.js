document.addEventListener('DOMContentLoaded', function() {
    var v = document.getElementsByTagName('audio')[0];
    
    if(!isMobile.any()) {
        v.oncanplay = function() {
            // set the play control to pause because of autoplay
            // $('.listen-live-player #play').toggleClass('fa-pause-circle-o');
            
            // set initial volume .5
            v.volume = .5;
        };
    }

    if(isMobile.any()) {
        document.querySelector('.player-volume-controls').classList.add('mobile')
        document.querySelector('.play-pause').classList.add('mobile')
    }

    var button = document.querySelector('.o-play-btn');

    button.onclick = function() {
        button.classList.toggle('o-play-btn--playing');
        playnpause()
    }
    
    // volume controls
    document.querySelector('#volume').addEventListener('change', function(){
        v.volume = this.value/100;
    });
    
    function playnpause(){
        
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