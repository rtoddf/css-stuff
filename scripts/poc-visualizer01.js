var container_parent = $('.display'),
    chart_container = $('#wave'),
    margins = {top: 0, right: 0, bottom: 0, left: 0},
    width = container_parent.width(),
    height = container_parent.height(),
    barPadding = '1',
    vis, vis_group, aspect

$(document).ready(function () {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var audioElement = document.getElementById('audioElement');
    var audioSrc = audioCtx.createMediaElementSource(audioElement);
    var analyser = audioCtx.createAnalyser();

    // Bind our analyser to the media element source.
    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);

    //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    var frequencyData = new Uint8Array(60);

    console.log('frequencyData: ', frequencyData)

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

    aspect = chart_container.width() / chart_container.height()

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
            .domain([0, d3.max(frequencyData)])
            .range([0, .5]);

        var hslScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, 100]);

        // Update d3 chart with new data.
        vis_group.selectAll('rect')
            .data(frequencyData)
            .attr({
                'y': function(d) {
                   return height - d;
                   // return height - d * 1.25;
                },
                'height': function(d) {
                   return d;
                },
                'fill': function(d) {
                    return d3.hsl(360, hslScale(d), hslScale(d)*.7);
                    // if(d <= 150){
                    //     return 'rgb(' + (d + 50) + ', 0, 0)';
                    // } else if(d > 150 && d < 200) {
                    //     return 'rgb(0, ' + (d - 100) + ', 0)';
                    // } else {
                    //     return 'rgb(0, 0, ' + (d - 50) + ')';
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

$(window).on('resize', function() {
    var targetWidth = container_parent.width()
    vis.attr({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})