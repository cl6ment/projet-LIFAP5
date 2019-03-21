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



function transformeDate(d){
	d = new Date(d);
	return d.getDay() + '/' + d.getMonth() + '/' + d.getFullYear();
}





// prend un array et en extrait les infos pour créer du HTML
function creerSujetHTML(obj){
	return `
		<div class="debat-overview" id="_${obj._id}">
			<div>
				<div class="sujet">${obj.topic}</div>
				<div class="derniere-contrib">
					<i class="material-icons">timelapse</i>
					${transformeDate(obj.date)}
				</div>
			</div>
			<div class="nb-contrib">${obj.contributions.length}</div
		</div>`;
}




function afficherListeDebats(listeObj){
	const html = $("#liste-debat-overview .scrollbox")
	
	// reset du contenu primitif
	html.innerHTML = '';
		


	// TODO: remplacer le foreach par un reduce
	// affichage du html 
	listeObj.forEach(function(e){
		html.innerHTML = html.innerHTML + creerSujetHTML(e)
	})


	// pose des ecouteurs d'event
	listeObj.forEach(function(e){
		$("#_"+e._id).addEventListener('click', () => {
			$("#debat-detailview #sujet").innerHTML = afficherDetailDebat(e);
			$("#messages").innerHTML = afficherListeCommentaires(e);
		})
	})

}



function afficherDetailDebat(obj){
	return `
	<h2>${obj.topic}</h2>
	<div id="auteur">
		<span>Initiateur: </span> ${obj.user}				
	</div>
	<div id="date">
		<span>Début: </span>${transformeDate(obj.date)}		
	</div>
	<p>${obj.desc}</p>`
}



function afficherCommentaire(obj){
	return `
	<div class="message" message-id="">

		<div class="user">
			<div class="pseudo">${obj.user}</div>
				 &#8226; 
			<div class="date">${transformeDate(obj.date)}</div>
		</div>

		<div class="content">${obj.content}</div>

		<div class="action">
			<div class="dislike">
				<i class="material-icons">sentiment_very_dissatisfied</i>
			</div>
			<div class="like">
				<i class="material-icons">sentiment_very_satisfied</i>
			</div>
		</div>

	</div>`;
}



function afficherListeCommentaires(data){

	

	return data.contributions.reduce(function(acc, v){
		acc += afficherCommentaire(v);
		return acc;
	}, "");

}




// dummy load
request('./json/Projet-2019-topics.json').then((data) => {
	
	// todo ajout d'un splash screen quand aucun débat n'est selectionné
	// todo: rajouter un on dom content loaded
	// todo: parser la date avec l'api Date()
	// todo: faire une copie de data
	// todo: utiliser reduce a la place de foreach
	


	// affiche la liste des débats
	afficherListeDebats(data);



	// recherche dans les débats
	$("#recherche-text").addEventListener('keyup', (e) => {

		if(e.which === 13){

			const query = $("#recherche-text").value;

			const filteredData = data.filter(function(e){
				if(e.desc.indexOf(query) != -1 || e.topic.indexOf(query) != -1){
					return true;
				} else {
					return false;
				}
			})

			afficherListeDebats(filteredData);

		}

	})



	// clic sur connexion
	$("#connexion").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'block';
		$("#darken").style.display = 'block';
	})

	// clic sur annuler
	$("#annuler").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'none';
		$("#darken").style.display = 'none';
	})

	// clic sur darken
	$("#darken").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'none';
		$("#darken").style.display = 'none';
	})


	// clic sur valider
	$("#valider").addEventListener('click', () => {

		const api = $("#clef-api").value;

		if(api != ""){
			$("#connexion-popup").style.display = 'none';
			$("#darken").style.display = 'none';
		}

	})


	// clic sur trier
	$("#filtrer").addEventListener('click', () => {
		console.log("[FILTRER]")
	})


	// clic sur le fab
	$(".fab").addEventListener('click', () => {
		console.log("[FAB]")
	})




	// ajout d'un message
	$("#ajouter-message").addEventListener('keyup', function(e){

		if(e.which === 13){
			const content = $("#ajouter-message").value
			console.log(content)
		}
	})
})


