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





// dummy load
request('./json/Projet-2019-topics.json').then((data) => {

	
	data.forEach(function(e){
		let message = '<div class="debat-overview"><div><div class="sujet">'
		message += e.topic
		message += '</div><div class="derniere-contrib">'
		message += e.date
		message += '</div></div><div class="nb-contrib">'
		message += e.contributions.length
		message += '</div</div>'

		console.log(message)

	})


})