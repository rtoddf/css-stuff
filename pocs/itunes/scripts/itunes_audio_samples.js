var baseSearchString = 'http://itunes.apple.com/search'

var artist,
    track_name

document.querySelector('#button').addEventListener('click', function(){
    artist = document.querySelector('#artist').value
    track_name = document.querySelector('#track_name').value

    ItunesSamples.get()
})

var ItunesSamples = new function(){
    this.get = function(){
        var html = '';
    
        var searchTerm = (artist + ' ' + track_name).replace(/ /g, '+');
        var searchString = baseSearchString + '?term=' + searchTerm + '&entity=musicTrack'

        fetch(searchString)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				if(data.results.length !== 0){
					data.results.forEach(function(track, i){
						if(track.artistName.toLowerCase() == artist.toLowerCase() && track.kind === 'song'){
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
                                            <p class="genre">` + track.primaryGenreName + `</p>
                                        </div>
                                    </div>
                                    <audio controls>
                                        <source src="` + track.previewUrl + `">
                                    </audio>
                                </article>
							`
						}
					})

					document.querySelector('#samples').innerHTML = html;
				}

			}).catch(function (err) {
				html = `<h4 class="error">There were no results. Check your search parameters and try again.</h4>`

				document.querySelector('#samples').innerHTML = html;
			});
    }
}