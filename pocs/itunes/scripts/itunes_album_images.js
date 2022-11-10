var baseSearchString = 'http://itunes.apple.com/search';
var track_name,
  artist,
  tracks = [],
  artist_name;

document.querySelector('#button').addEventListener('click', function () {
  artist = document.querySelector('#artist').value;
  track_name = document.querySelector('#track_name').value;

  ItunesTrackImages.get(track_name);
});

var ItunesTrackImages = new (function () {
  console.log();

  this.get = function (track) {
    var searchString =
      baseSearchString +
      '?term=' +
      (artist + ' ' + track_name).replace(/ /g, '+') +
      '&entity=musicTrack';
    var html = '';

    console.log('searchString: ', searchString);

    fetch(searchString)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.results.length !== 0) {
          data.results.forEach(function (track, i) {
            if (track.artistName.toLowerCase() == artist.toLowerCase()) {
              html +=
                `
								<div class="track photos">
									<h4>Artwork size: 100px x 100px</h4>
									<div class="artwork"> \
										<img src="` +
                track.artworkUrl100 +
                `" />
									</div>
									<h4>Artwork size: 225px x 225px</h4>
									<div class="artwork">
										<img src="` +
                track.artworkUrl100.replace('100x100', '225x225') +
                `" />
									</div>
									<h4>Artwork size: 600px x 600px</h4>
									<div class="artwork">
										<img src="` +
                track.artworkUrl100.replace('100x100', '600x600') +
                `" />
									</div>
								</div>
							`;
            }
          });

          document.querySelector('#track-images').innerHTML = html;
        }
      })
      .catch(function (err) {
        html = `<h4 class="error">There were no results. Check your search parameters and try again.</h4>`;

        document.querySelector('#track-images').innerHTML = html;
      });
  };
})();
