// selecteur universel (juste un raccourcis pour sélectionner des elts)
function $(s){
	return document.querySelector(s);
}

// fonction de requête
async function request(url, typeRetour='json'){

	const response = await fetch(url)
	if(response.status < 400){
		if(typeRetour == 'json'){
			return await response.json()
		} else if('text') {
			return await response.text()
		}
	} else {
		throw '['+response.status+'] status code'
	} 

}



function recupDerniereActivite(obj){

}



// prend un array et en extrait les infos pour créer du HTML
function creerSujetHTML(obj){
	const d = new Date(obj.date);

	return `
		<div class="debat-overview">
			<div>
				<div class="sujet">${obj.topic}</div>
				<div class="derniere-contrib">
					<i class="material-icons">timelapse</i>
					${d.getDay() + '/' + d.getMonth() + '/' + d.getFullYear()}
				</div>
			</div>
			<div class="nb-contrib">${obj.contributions.length}</div
		</div>`;
}




// dummy load
request('./json/Projet-2019-topics.json').then((data) => {

	// const htmlData = data.map(function(v, i){
	// 	console.log(v, i)
	// })


	// todo: parser la date avec l'api Date()
	// todo: faire une copie de data
	// todo: utiliser reduce a la place de foreach
	

	const html = $("#liste-debat-overview .scrollbox")
	data.forEach(function(e){
		html.innerHTML = html.innerHTML + creerSujetHTML(e)
	})


})