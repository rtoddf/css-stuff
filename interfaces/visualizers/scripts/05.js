var margins = { top: 0, right: 0, bottom: 0, left: 0 },
  width = document.querySelector('.display').offsetWidth,
  height = document.querySelector('.display').offsetHeight,
  barPadding = '1',
  vis,
  vis_group;

document.addEventListener('DOMContentLoaded', function () {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  // bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  // var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(240);

  console.log('frequencyData: ', frequencyData);

  // One-liner to resume playback when user interacted with the page.
  document.querySelector('.o-play-btn').addEventListener('click', function () {
    audioCtx.resume().then(() => {
      console.log('Playback resumed successfully');
    });
  });

  document.querySelector('.player-controls').style.display = 'block';

  vis = d3
    .select('#wave')
    .append('svg')
    .attr({
      width: width,
      height: height,
      preserveAspectRatio: 'xMinYMid',
      viewBox: '0 0 ' + width + ' ' + height,
    });

  vis_group = vis.append('g').attr({
    transform: 'translate(' + margins.left + ',' + margins.top + ')',
  });

  // continuously loop and update chart with frequency data.
  function renderChart() {
    requestAnimationFrame(renderChart);

    // copy frequency data to frequencyData array.
    analyser.getByteFrequencyData(frequencyData);

    // scale things to fit
    var radiusScale = d3.scale
      .linear()
      .domain([0, d3.max(frequencyData)])
      .range([0, height / 2.25]);

    var strokeScale = d3.scale
      .linear()
      .domain([0, d3.max(frequencyData)])
      .range([0, 10]);

    var opacityScale = d3.scale
      .linear()
      .domain([0, d3.max(frequencyData)])
      .range([0, 0.25]);

    // update d3 chart with new data
    var circles = vis_group.selectAll('circle').data(frequencyData);

    circles.enter().append('circle');

    circles.attr({
      r: function (d) {
        return radiusScale(d);
      },
      cx: width / 2,
      cy: height / 2,
      fill: 'none',
      'stroke-width': function (d) {
        return strokeScale(d);
      },
      'stroke-opacity': function (d) {
        return opacityScale(d);
      },
      stroke: function (d) {
        if (d <= 100) {
          return d3.hsl(348, 0.9, 0.4);
        } else if (d > 100 && d < 150) {
          return d3.hsl(348, 0.9, 0.4);
        } else {
          return d3.hsl(348, 0.9, 0.4);
        }
      },
    });

    circles.exit().remove();
  }

  // run the loop
  renderChart();

  // just for blocks viewer size
  d3.select(self.frameElement).style('height', '700px');
});
