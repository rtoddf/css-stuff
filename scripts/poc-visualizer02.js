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
 
    // bind our analyser to the media element source.
    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);
 
    // var frequencyData = new Uint8Array(analyser.frequencyBinCount);
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
 
    // continuously loop and update chart with frequency data.
    function renderChart() {
        requestAnimationFrame(renderChart);
 
        // copy frequency data to frequencyData array.
        analyser.getByteFrequencyData(frequencyData);
        // console.log(frequencyData);
 
        // scale things to fit
        var radiusScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([20, height/2 - 10]);
 
        var hueScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, 360]);

        var strokeScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, 6]);

        var opacityScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, .5]);

        var hslScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, 100]);
 
        // update d3 chart with new data
        var circles = vis_group.selectAll('circle')
            .data(frequencyData);
 
        circles.enter().append('circle');
 
        circles
            .attr({
                r: function(d) {
                    return radiusScale(d);
                },
                cx: width/2,
                cy: height/2,
                fill: 'none', 
                'stroke-width': function(d){
                    return strokeScale(d)
                },
                'stroke-opacity': function(d){
                    return opacityScale(d)
                },
                stroke: function(d) {
                    return d3.hsl(360, hslScale(d), hslScale(d)*.7);
                    // return d3.hsl(hueScale(d), 0.5, 0.5);
                }
           });
 
        circles.exit().remove(); 
    }
 
    // run the loop
    renderChart();
 
    // just for blocks viewer size
    d3.select(self.frameElement).style('height', '700px');
 
});