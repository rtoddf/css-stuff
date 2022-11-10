document.querySelector('#carousel')


document.querySelector('#toggle-backface-visibility').addEventListener('click', function(){

})


.classList.add( panelClassName );
.classList.remove( panelClassName );
.classList.toggle('panels-backface-invisible');



.querySelectorAll('button'))
audioElement.getAttribute('data-artist')


fetch('./data/slides01.json')
	.then(function (response) {
		return response.json();
	}).then(function (data) {
		data.forEach(function(n){
			html += `
				<figure>
					<div class="image-holder">
						<span class="filler">
							<img src="./images/` + n.image + `" alt="` + n.title + `">
						</span>
					</div>
					<div class="content-holder">
						<h4>` + n.title + `</h4>
					</div>
				</figure>
			`;
		})

		document.querySelector('#carousel').innerHTML = html;
		document.querySelector('#panel-count').setAttribute('max', data.length);
		document.querySelector('#panel-count').setAttribute('value', data.length/2);

		init();
	}).catch(function (err) {
		// There was an error
		console.warn('Something went wrong.', err);
	});



html += `
	<figure>
		<div class="image-holder">
			<span class="filler">
				<img src="./images/` + n.image + `" alt="` + n.title + `">
			</span>
		</div>
		<div class="content-holder">
			<h4>` + n.title + `</h4>
		</div>
	</figure>
`;