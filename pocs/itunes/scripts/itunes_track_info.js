var baseSearchString = 'http://itunes.apple.com/search'

document.querySelector('#button').addEventListener('click', function(){
    var track_name = document.querySelector('#track_name').value
    ItunesTracks.get(track_name)
})

var ItunesTracks = new function(){

    this.get = function(track_name){
        tracks.length = 0
        var html = '';
        var searchTerm = (track_name).replace(/ /g, '+');
        var searchString = baseSearchString + '?term=' + searchTerm + '&entity=musicTrack'

        fetch(searchString)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                if(data.results.length !== 0){
                    (data.results).forEach(function(track){
                        if(track.kind == 'song'){
                            var releaseDate = typeof(track.releaseDate) !== 'undefined' && track.releaseDate !== null ? new Date(track.releaseDate).getFullYear() : '';
                            html += `
                                <article class="jukebox-card">
                                    <div class="inner">
                                        <div class="song-artwork">
                                            <img src="` + track.artworkUrl100 + `" />
                                        </div>
                                        <div class="song-info">
                                            <p class="artist-name">` + track.artistName + `</p>
                                            <p class="track-name">` + track.trackName + `</p>
                                            <p class="album-title">` + track.collectionName + `</p>
                                            <p class="genre">` + releaseDate + ` - ${track.primaryGenreName}</p>
                                        </div>
                                    </div>
                                </article>
                            `
                        }
                    })

                    document.querySelector('#tracks').innerHTML = html;
                }

            }).catch(function (err) {
                html = `<div><p class="error">No results. Please try another artist.</p></div>`

                document.querySelector('#tracks').innerHTML = html;
            });
    }

    this.render = function(){
        // sort???
    }
}