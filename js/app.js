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


// donne la date de dernière activité sur un débat
function recupDateDerniereActivite(obj){
	// overkill ???
	// const sorted = obj.sort((a, b) => ((a.date > b.date) ? -1 : 1))
	return obj[0].date;
}


// donne une date lisible par un humain
function transformeDate(d){
	d = new Date(d);
	return ('0' + d.getDay()).slice(-2) + '/' + ('0' + d.getMonth()).slice(-2) + '/' + d.getFullYear();
}




// =============================
// Génération de HTML
// =============================
// créé le HTML de la liste des sujet de débat
function creerSujetHTML(obj){
	return `
	<div class="debat-overview" id="_${obj._id}">
		<div>
			<div class="sujet">${obj.topic}</div>
			<div class="derniere-contrib">
				<i class="material-icons">timelapse</i>
				${transformeDate(recupDateDerniereActivite(obj.contributions))}
			</div>
		</div>
		<div class="nb-contrib">${obj.contributions.length}</div>
	</div>`;
}


// créé le HTML du sujet d'un débat
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


// créé le HTML d'un commentaire lié à un débat
function afficherCommentaire(obj, i){
	return `
	<div class="message" id="mess-${i}">

		<div class="user">
			<div class="pseudo">${obj.user}</div>
			&#8226; 
			<div class="date">${transformeDate(obj.date)}</div>
		</div>

		<div class="content">${obj.content}</div>
		<div class="action">

			<div class="like">
				<i class="material-icons">thumb_up</i>
				<span>${obj.likers.length}</span>
			</div>
			
			<div class="dislike">
				<i class="material-icons">thumb_down</i>
				<span>${obj.unlikers.length}</span>
			</div>

			<div class="supprimer">
				<i class="material-icons">delete</i>
			</div>

			<div class="modifier">
				<i class="material-icons">edit</i>
			</div>

		</div>			
	</div>`;
}




// ================================
// insertion de HTML, pose d'écouteur
// ================================

// affiche la liste des commentaires à un débat
function afficherListeCommentaires(data){
	return data.contributions.reduce((acc, v, i) => {
		acc += afficherCommentaire(v, i);
		return acc;
	}, "");
}



// affiche la liste complète des sujet d'un débat
function afficherListeDebats(listeObj){

	// todo: lier cette fonction avec la fonction de tri

	const html = $("#liste-debat-overview .scrollbox");

	// insertion du html
	html.innerHTML = listeObj.reduce((acc, v) => {
		acc += creerSujetHTML(v)
		return acc;
	}, '');

	// pose des ecouteurs d'event
	listeObj.forEach((e) => {

		// écouteur sur la liste des sujets
		$("#_"+e._id).addEventListener('click', () => {

			$("#debat-detailview #sujet").innerHTML = afficherDetailDebat(e);
			$("#messages").innerHTML = afficherListeCommentaires(e);

			// écouteurs sur un commentaire d'un débat
			e.contributions.forEach((v, i) => {
				$("#mess-"+i+" .dislike").addEventListener('click', (e) => {
					console.log('[dislike]')
					console.log($("#mess-"+i))
					// todo : requete
				})

				$("#mess-"+i+" .like").addEventListener('click', (e) => {
					console.log('[like]')
					console.log($("#mess-"+i))
					// todo: requete
				})

				$("#mess-"+i+" .supprimer").addEventListener('click', (e) => {
					console.log('[supprimer]')
					console.log($("#mess-"+i))
					// todo : requete
				})

				$("#mess-"+i+" .modifier").addEventListener('click', (e) => {
					console.log('[modifier]')
					console.log($("#mess-"+i))
					// todo: requete
				})

			})

		})
	})


}




// todo: déplacer le request dans le domcontentloaded
request('http://localhost/LIFAP5/PROJET/json/Projet-2019-topics.json').then((data) => {
	
	// state
	let state = {
		'listeDebats': data,
		'api-key': 'a1b2c3d4e5f67890',
		'tri': 'date',
		'sujetCourant': ''
	}


	// affiche la liste des débats
	afficherListeDebats(data);



	// recherche dans les débats
	$("#recherche-text").addEventListener('keyup', (e) => {

		const query = $("#recherche-text").value;
		const filteredData = data.filter((e) => (e.desc.indexOf(query) != -1 || e.topic.indexOf(query) != -1));
		afficherListeDebats(filteredData);

	})



	// TRIER
	$("#trier select").addEventListener('change', (e) => {

		const tri = $("#trier select").value;

		if(tri === "date"){
			const listeTriee = data.sort((a, b) => ((a.date > b.date) ? -1 : 1));
			afficherListeDebats(listeTriee);
		} else if(tri === "titre"){
			const listeTriee = data.sort((a, b) => ((a.topic > b.topic) ? -1 : 1));
			afficherListeDebats(listeTriee);
		} else {
			const listeTriee = data.sort((a, b) => ((a.contributions.length > b.contributions.length) ? -1 : 1));
			afficherListeDebats(listeTriee);
		}


	})




	// ajout d'un message
	$("#ajouter-message").addEventListener('keyup', function(e){
		if(e.which === 13){
			const content = $("#ajouter-message").value
			console.log(content)
			// TODO: requete
		}
	})



})



// =====================================
// event listener sur contenu statique
// =====================================
document.addEventListener('DOMContentLoaded', () => {

	// DARKEN
	$("#darken").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'none';
		$("#darken").style.display = 'none';
		$("#creation-debat").style.display = 'none';
	})


	// SAISIE CLEF API
	// connexion
	$("#connexion").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'block';
		$("#darken").style.display = 'block';
	})

	// annuler
	$("#connexion-popup #annuler").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'none';
		$("#darken").style.display = 'none';
	})

	// valider
	$("#connexion-popup #valider").addEventListener('click', () => {

		const api = $("#clef-api").value;

		if(api != ""){
			$("#connexion-popup").style.display = 'none';
			$("#darken").style.display = 'none';

			// TODO: reorganiser le js pour prendre en compte clef api (classes ?)
		}

	})


	// CREATION D'UN DEBAT
	// fab
	$(".fab").addEventListener('click', () => {
		$("#creation-debat").style.display = 'block';
		$("#darken").style.display = 'block';
	})

	// publier
	$("#publier").addEventListener('click', () => {
		// TODO: requête
	})

	// annuler
	$("#creation-debat #annuler").addEventListener('click', () => {
		$("#creation-debat").style.display = 'none';
		$("#darken").style.display = 'none';
	})

})
