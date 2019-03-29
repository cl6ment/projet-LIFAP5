/*jshint esversion: 9 */

// selecteur universel (juste un raccourcis pour sélectionner des elts)
function $(s){
	return document.querySelector(s);
}

// fonction de requête
async function request(url, typeRetour='json'){

	const response = await fetch(url);
	if(response.status < 400){
		if(typeRetour == 'json'){
			return await response.json();
		} else if('text') {
			return await response.text();
		}
	} else {
		throw `[${response.status}] status code`;
	} 

}


// donne la date de dernière activité sur un débat
function recupDateDerniereActivite(debat){
	if(debat.length > 0){
		// overkill ???
		// const sorted = debat.sort((a, b) => ((a.date > b.date) ? -1 : 1))
		return debat[0].date;
	} else {
		return false;
	}
}


// donne une date lisible par un humain
function transformeDate(d){
	if(d === false){
		return "Jamais";
	} else {		
		d = new Date(d);
		return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
	}
}


// sort
function triDebats(state, tri='topic'){

	if(tri === "date"){
		state.listeDebats = state.listeDebats.sort((a, b) => {
			const d1 = new Date(a.date);
			const d2 = new Date(b.date);

			if(isNaN(d1)) return -1;
			if(isNaN(d2)){
				return 1;
			}
			
			if(d1.getFullYear() > d2.getFullYear()){
				return 1;
			} else if(d1.getFullYear() < d2.getFullYear()){
				return -1;
			} else {
				if(d1.getMonth() > d2.getMonth()){
					return 1;
				} else if(d1.getMonth() < d2.getMonth()){
					return -1;
				} else {
					if(d1.getDate() > d2.getDate()){
						return 1;
					} else if(d1.getDate() < d2.getDate()){
						return -1;
					} else {
						return 1; // your pick
					}
				}
			}
		});
	} else if(tri === "topic"){
		state.listeDebats = state.listeDebats.sort((a, b) => ((a.topic > b.topic) ? 1 : -1));
	} else {
		state.listeDebats = state.listeDebats.sort((a, b) => ((a.contributions.length > b.contributions.length) ? -1 : 1));
	}
}



// =============================
// Génération de HTML
// =============================
// créé le HTML de la liste des sujet de débat
function creerSujetHTML(debat){
	const color = (debat.open === "false")?"#F44336":"#66BB6A";
	return `
	<div class="debat-overview" id="_${debat._id}">
		<div>
			<div class="sujet">${debat.topic}</div>
			<div class="derniere-contrib">
				<i class="material-icons">timelapse</i>
				${transformeDate(recupDateDerniereActivite(debat.contributions))}
			</div>
		</div>
		<div class="nb-contrib" style="border-color: ${color}">${debat.contributions.length}</div>
	</div>`;
}


// créé le HTML du sujet d'un débat
function afficherDetailDebat(debat){
	return `
	<h2>${debat.topic}</h2>
	<div id="auteur">
		<span>Initiateur: </span> ${debat.user}				
	</div>
	<div id="date">
		<span>Début: </span>${transformeDate(debat.date)}		
	</div>
	<p>${debat.desc}</p>`;
}


// créé le HTML d'un commentaire lié à un débat
function afficherCommentaire(state, comm, i){

	const modHTML = (comm.user === state.user) ? 
	`<div class="supprimer">
		<i class="material-icons">delete</i>
	</div>

	<div class="modifier">
		<i class="material-icons">edit</i>
	</div>` : ``;

	return `
	<div class="message" id="mess-${i}">

		<div class="user">
			<div class="pseudo">${comm.user}</div>
			&#8226; 
			<div class="date">${transformeDate(comm.date)}</div>
		</div>

		<div class="content">${comm.content}</div>
		<div class="action">

			<div class="like">
				<i class="material-icons">thumb_up</i>
				<span>${comm.likers.length}</span>
			</div>
			
			<div class="dislike">
				<i class="material-icons">thumb_down</i>
				<span>${comm.unlikers.length}</span>
			</div>
			${modHTML}
		</div>			
	</div>`;
}




// ================================
// insertion de HTML, pose d'écouteur
// ================================

// affiche la liste des commentaires à un débat
function afficherListeCommentaires(state, debat){
	return debat.contributions.reduce((acc, v, i) => {
		acc += afficherCommentaire(state, v, i);
		return acc;
	}, "");
}


function afficherDebat(debat){
	// afficher le débat
	$("#debat-detailview #sujet").innerHTML = afficherDetailDebat(debat);
	$("#messages").innerHTML = afficherListeCommentaires(state, debat);

	// désactive l'ajout de commentaire sur les sujet clos
	if(debat.open === "false"){
		$("#ajouter-message").disabled = true;
	} else {
		$("#ajouter-message").disabled = false;
	}

	// écouteurs sur un commentaire d'un débat
	debat.contributions.forEach((v, i) => {
		$("#mess-"+i+" .dislike").addEventListener('click', (e) => {
			console.log('[dislike]');
			console.log($("#mess-"+i));
			// todo : requete
		});

		$("#mess-"+i+" .like").addEventListener('click', (e) => {
			console.log('[like]');
			console.log($("#mess-"+i));
			// todo: requete
		});

		// désactive les event listener pour les commentaires autre que les siens
		if($("#mess-"+i+" .supprimer") !== null){
			$("#mess-"+i+" .supprimer").addEventListener('click', (e) => {
				console.log('[supprimer]');
				console.log($("#mess-"+i));
				// todo : requete
			});
	
			$("#mess-"+i+" .modifier").addEventListener('click', (e) => {
				console.log('[modifier]');
				console.log($("#mess-"+i));
				// todo: requete
			});
		}

	});
}


// affiche la liste complète des sujet d'un débat
function afficherListeDebats(state){
	
	triDebats(state, state.tri);

	const html = $("#liste-debat-overview .scrollbox");

	// insertion du html des sujets des débats
	html.innerHTML = state.listeDebats.reduce((acc, sujetDebat) => {
		acc += creerSujetHTML(sujetDebat);
		return acc;
	}, "");

	// on pose les écouteurs sur tous les sujets des débats
	state.listeDebats.forEach((debat) => {

		// au clic, on affiche le débat
		$("#_"+debat._id).addEventListener('click', () => {
			afficherDebat(debat);
			state.sujetCourant = debat._id;
		});

	});

}



// todo: remplacer le let state par la fonction state
function State(users = [], topics = [], filters = [], sort = "NONE"){
	this.users   = users;
	this.topics  = topics.map(x => ({...x, date : new Date(x.date)})); // spread op
	this.filters = filters;
	this.sort    = sort;
	// api key, user ?
}
// console.log(State.users)


// variable state globale
let state = {
	'listeDebats': [],
	'api-key': 'a1b2c3d4e5f67890',
	'user': 'clement.herve',
	'tri': 'date', // valeur par défaut
	'sujetCourant': '<h1>Cela manque de débat par ici! </h1>' // valeur par défaut
};


// chargement initial des données
request('http://localhost/LIFAP5/PROJET/json/Projet-2019-topics.json')
.then((data) => {
	state.listeDebats = data;
	afficherListeDebats(state);
})
.catch((e) => {
	console.log("Il y a eu une erreur !", e);
});



// =====================================
// event listener sur contenu statique
// =====================================
document.addEventListener('DOMContentLoaded', () => {

	// DARKEN
	$("#darken").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'none';
		$("#darken").style.display = 'none';
		$("#creation-debat").style.display = 'none';
	});


	// SAISIE CLEF API
	// connexion
	$("#connexion").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'block';
		$("#darken").style.display = 'block';
	});

	// annuler
	$("#connexion-popup #annuler").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'none';
		$("#darken").style.display = 'none';
	});

	// valider
	$("#connexion-popup #valider").addEventListener('click', () => {
		const key = $("#clef-api").value;
		if(key !== ""){
			$("#connexion-popup").style.display = 'none';
			$("#darken").style.display = 'none';
			state["api-key"] = key;
		}
	});


	// CREATION D'UN DEBAT
	// fab
	$(".fab").addEventListener('click', () => {
		$("#creation-debat").style.display = 'block';
		$("#darken").style.display = 'block';
	});

	// publier
	$("#publier").addEventListener('click', () => {
		// TODO: requête
		const topic = $("#topic-debat").value;
		const content = $("#content-debat").value;

		if(topic !== "" && content !== ""){
			console.log(topic, content);
		}
	});

	// annuler
	$("#creation-debat #annuler").addEventListener('click', () => {
		$("#creation-debat").style.display = 'none';
		$("#darken").style.display = 'none';
	});


	// CONTRIBUTION A UN DEBAT
	$("#ajouter-message").addEventListener('keyup', function(e){
		if(e.which === 13){
			const content = $("#ajouter-message").value;
			if(content !== ""){
				console.log(content);
				// TODO: requete	
			}
		}
	});


	// recherche dans les débats
	$("#recherche-text").addEventListener('keyup', (e) => {
		const query = $("#recherche-text").value;
		const listeDebats = state.listeDebats;
		state.listeDebats = state.listeDebats.filter((e) => (e.desc.indexOf(query) != -1 || e.topic.indexOf(query) != -1));
		afficherListeDebats(state);
		state.listeDebats = listeDebats;
	});



	// TRIER
	$("#trier select").addEventListener('change', (e) => {
		const tri = $("#trier select").value;
		state.tri = tri;
		afficherListeDebats(state);
	});

});
