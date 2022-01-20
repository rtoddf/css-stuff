var container_parent = $('.display'),
    chart_container = $('#wave'),
    margins = {top: 0, right: 0, bottom: 0, left: 0},
    width = container_parent.width(),
    height = container_parent.height(),
    barPadding = '1',
    vis, vis_group, aspect

var isDefined = function(obj){
    return typeof(obj) !== 'undefined' && obj !== null ? obj : ''
}

$(document).ready(function () {
    Songs.getSongs()
})

var isDefined = function (obj) {
    return typeof (obj) !== 'undefined' && obj !== null ? obj : ''
}

var Song = function (artist, title) {
    this.artist = isDefined(artist)
    this.title = isDefined(title)
}

var Songs = new function () {
    this.getSongs = function () {
        songs = []
        $.getJSON('data/jukebox-music01.json', function (data) {
            data.forEach(function (item) {
                console.log('item: ', item)
                var song = new Song(item.artist, item.title)
                songs.push(song)
            })
            getItunesData(songs);
        })
    }
}

function getItunesData(songs){
    // console.log('songs: ', songs)

    var baseSearchString = 'http://itunes.apple.com/search'

    var artist;
    var tracks = [];
    tracks.length = 0

    for (var i = 0; i < songs.length; i++) {
        console.log("artist: ", songs[i].artist)
        console.log("title: ", songs[i].title)

        // artist = songs[i].artist;

        var searchTerm = (songs[i].artist + ' ' + songs[i].title).replace(/ /g, '+');
        var searchString = baseSearchString + '?term=' + searchTerm + '&entity=musicTrack&callback=?'

        $.getJSON(searchString, function (data) {
            (data.results).forEach(function (track, i) {
                console.log("track: ", track)
                console.log("artist: ", artist)

                if ($(data.results).get(i).artistName.toLowerCase() == (songs[i].artist).toLowerCase() && $(data.results).get(i).kind === 'song') {
                    tracks.push(track)
                    artist_name = $(data.results).get(i).artistName;
                }
            })

            
        })

        console.log("tracks: ", tracks)
    }
}

var template_raw = '<article class="jukebox-card"> \
    <div class="inner"> \
        <div id="play" class="song-artwork"> \
            <img src="<%= data.artworkUrl100 %>" /> \
        </div> \
        <div class="song-info"> \
            <p class="artist-name"><%= data.artistName %></p> \
            <p class="track-name"><%= data.trackName %></p> \
            <p class="genre"><%= new Date(data.releaseDate).getFullYear() %>  - <%= data.primaryGenreName %></p> \
        </div> \
    </div> \
</article>'