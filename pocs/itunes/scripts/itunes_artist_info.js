var baseSearchString = 'http://itunes.apple.com/search'
var result_limit = 20

document.querySelector('#button').addEventListener('click', function(){
	var html = '';
	var artist = document.querySelector('#artist').value;
	var searchString = baseSearchString + '?term=' + (artist).replace(/ /g, '+') + '&entity=musicTrack&limit=' + result_limit

	fetch(searchString)
        .then(function (response) {
            return response.json();
        }).then(function (data) {

			if(data.results.length !== 0){
				(data.results).forEach(function(result, i){
					if(result.artistName.toLowerCase() == artist.toLowerCase()){
						var track = new Track(result)

						html += `
							<article class="panel">
								<div class="track">
									<div class="artwork">
										<img src="` + track.artwork_100.replace('100x100', '225x225') + `" />
									</div>
									<ul>
										<li>Artist: <a href="` + track.artist_url + `" target="_blank">` + track.artist_name + `</a></li>
										<li>Artist id: ` + track.artist_id + `</li>
										<li>Track name: <a href="` + track.track_url + `" target="_blank">` + track.track_name + `</a></li>
										<li>Track id: ` + track.track_id + `</li> \
										<li>Track release date: ` + track.track_release_date_year + `</li>
										<li>Track kind: ` + track.track_kind + `</li>
										<li>Track price: $` + track.track_price + `</li>
										<li>Track time: ` + track.track_time + ` seconds</li>
										<li>Primary genre: ` + track.primary_genre + `</li>
									</ul>
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
})

var isDefined = function(obj){
	return typeof(obj) !== 'undefined' && obj !== null ? obj : ''
}

function Track(track){
	this.artist_name = isDefined(track.artistName)
	this.artist_id = isDefined(track.artistId)
	this.artist_url = isDefined(track.artistViewUrl)
	this.track_name = isDefined(track.trackName)
	this.track_id = isDefined(track.trackId)
	this.track_release_date_year = new Date(isDefined(track.releaseDate)).getFullYear()
	this.track_kind = isDefined(track.kind)
	this.track_price = isDefined(track.trackPrice)
	this.track_time =  Math.ceil(isDefined(track.trackTimeMillis) / 1000)
	this.track_url = isDefined(track.previewUrl)
	this.artwork_100 = isDefined(track.artworkUrl100)
	this.primary_genre = isDefined(track.primaryGenreName)
}