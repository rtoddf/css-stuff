var set01 = '';
var set02 = '';

//set up
fetch('./data/images.json')
	.then(function (response) {
		return response.json();
	}).then(function (data) {
        

		data.forEach(function(n){
            if(n.id < 6){
                set01 += `
                    <article data-image-layout="square">
                        <div class="tile">
                            <figure>
                                <img src="./images/` + n.image + `" alt="` + n.title + `">
                            </figure>
                            <div class="content-holder">
                                <h4>` + n.title + `</h4>
                            </div>
                        </div>
                    </article>
                `;
            } else {
                set02 += `
                    <article data-image-layout="square">
                        <div class="tile">
                            <figure>
                                <img src="./images/` + n.image + `" alt="` + n.title + `">
                            </figure>
                            <div class="content-holder">
                                <h4>` + n.title + `</h4>
                            </div>
                        </div>
                    </article>
                `;
            }
		})

		document.querySelector('#image-set01').innerHTML = set01;
        document.querySelector('#image-set02').innerHTML = set02;

		// init();
	}).catch(function (err) {
		// There was an error
		console.warn('Something went wrong.', err);
	});