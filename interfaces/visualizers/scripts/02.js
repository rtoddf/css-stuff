var container_parent = document.querySelector('.display').offsetWidth,
    margins = {top: 0, right: 0, bottom: 0, left: 0},
    width = document.querySelector('.display').offsetWidth,
    height = document.querySelector('.display').offsetHeight,
    barPadding = '1',
    vis, vis_group

document.addEventListener('DOMContentLoaded', function() {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var audioElement = document.getElementById('audioElement');
    var audioSrc = audioCtx.createMediaElementSource(audioElement);
    var analyser = audioCtx.createAnalyser();

    // Bind our analyser to the media element source.
    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);

    //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    var frequencyData = new Uint8Array(480);

    // console.log('frequencyData: ', frequencyData)

    // One-liner to resume playback when user interacted with the page.
    // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
    document.querySelector('.o-play-btn').addEventListener('click', function() {
        audioCtx.resume().then(() => {
            // console.log('Playback resumed successfully');
        });
    });

    document.querySelector('.player-controls').style.display = 'block';

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
                    return d3.hsl("yellow");
                    // return d3.hsl(360, hslScale(d), hslScale(d)*.7);
                    // if(d <= 150){
                    //     return 'rgb(' + (d + 50) + ', 0, 0)';
                    // } else if(d > 150 && d < 250) {
                    //     return 'rgb(174, ' + (d - 150) + ', 0)';
                    // } else {
                    //     return 'rgb(174, 0, ' + (d - 150) + ')';
                    // }
                },
                'opacity': function(d) {
                    return opacityScale(d)
                    // if(d < 150){
                    //     return d * .008;

                    // } else {
                    //     return d * .005;
                    // }
                }
            });
    }

    // Run the loop
    renderChart();

})