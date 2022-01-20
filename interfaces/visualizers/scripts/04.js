var margins = {top: 0, right: 0, bottom: 0, left: 0},
    width = document.querySelector('.display').offsetWidth,
    height = document.querySelector('.display').offsetHeight,
    barPadding = '1',
    vis, vis_group

var isDefined = function(obj){
    return typeof(obj) !== 'undefined' && obj !== null ? obj : ''
}

document.addEventListener('DOMContentLoaded', function() {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var audioElement = document.getElementById('audioElement');
    var audioSrc = audioCtx.createMediaElementSource(audioElement);
    var analyser = audioCtx.createAnalyser();

    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);

    var frequencyData = new Uint8Array(240);

    // console.log('frequencyData: ', frequencyData);

    var artist = $(audioElement).attr('data-artist'),
        song = $(audioElement).attr('data-song');
    
    getItunesData(artist, song);

    document.querySelector('.o-play-btn').addEventListener('click', function() {
        audioCtx.resume().then(() => {
            // console.log('Playback resumed successfully');
        });
    });

    vis = d3.select('#wave').append('svg')
        .attr({
            'width': width,
            'height': height,
            'preserveAspectRatio': 'xMinYMid',
            'viewBox': '0 0 ' + width + ' ' + height
        })

    vis_group = vis.append('g')
        .attr({
            'transform': 'translate(' + margins.left + ',' + margins.top + ')'
        })

    aspect = width / height

    // Create our initial D3 chart.
    vis_group.selectAll('rect')
        .data(frequencyData).enter()
        .append('rect')
        .attr({
            'x': function (d, i) {
                return i * (width / frequencyData.length);
            },
            'width': width / frequencyData.length - barPadding
        })

     // Continuously loop and update chart with frequency data.
    function renderChart() {
        requestAnimationFrame(renderChart);

        // Copy frequency data to frequencyData array.
        analyser.getByteFrequencyData(frequencyData);

        var opacityScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData) / 1.5])
            // .domain([0, 1])
            .range([0, 1]);

        var hslScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, 100]);

        var heightScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, 200]);

        // Update d3 chart with new data.
        vis_group.selectAll('rect')
            .data(frequencyData)
            .attr({
                'y': function(d) {
                   return (height - d) * 0.5;
                },
                'height': function(d) {
                    // return d - 20;
                    return heightScale(d);
                },
                'fill': function(d) {
                    return d3.hsl("#dd85fd");
                },
                'opacity': function(d) {
                    return opacityScale(d)
                }
            });
    }
    renderChart();
})

function getItunesData(artist, track_name){
    var baseSearchString = 'http://itunes.apple.com/search'

    var tracks = [];
    tracks.length = 0
    var searchTerm = (artist + ' ' + track_name).replace(/ /g, '+');
    var searchString = baseSearchString + '?term=' + searchTerm + '&entity=musicTrack&callback=?'

    $.getJSON(searchString, function(data){
        (data.results).forEach(function(track, i){
            console.log("track_name: ", track_name)

            if ($(data.results).get(i).artistName.toLowerCase() == artist.toLowerCase() && $(data.results).get(i).kind === 'song'){
                tracks.push(track)
                artist_name = $(data.results).get(i).artistName;
            }
        })

        var template_compiled = _.template(template_raw, {
            data: tracks[0]
        })
        $('#track').html(template_compiled)
        $('.player-controls').show();
        $('#audioElement').attr('src', tracks[0].previewUrl)
    })
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
