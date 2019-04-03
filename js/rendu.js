/*jshint esversion: 9 */


// ======================================================
// rendu du HTML, pose d'écouteur
// =====================================================

/**
 * @desc Affiche un débat et la liste de ses contribution
 * @param {*} debat 
 */
function afficherDebat(debat){
	// afficher le débat & ses contributions sur le panneau de droite
	$("#debat-detailview #sujet").innerHTML = genererDetailDebat(debat);
	$("#messages").innerHTML = genererListeContributions(State, debat);

	// désactiver l'ajout de contributions sur les sujet clos
	if(debat.open === "false"){
		$("#ajouter-message").disabled = true;
	} else {
		$("#ajouter-message").disabled = false;
	}

	// écouteurs sur les contributions d'un débat
	debat.contributions.forEach((v, i) => {
		$("#mess-"+i+" .dislike").addEventListener('click', (e) => {
			console.log('[dislike]');
			console.log($("#mess-"+i));
			// todo : requete vers le serveur, probablement un put pour le dislike
		});

		$("#mess-"+i+" .like").addEventListener('click', (e) => {
			console.log('[like]');
			console.log($("#mess-"+i));
			// todo : requete vers le serveur, probablement un put pour le like
		});

		// désactive les event listener pour les commentaires autre que les siens
		if($("#mess-"+i+" .supprimer") !== null){
			$("#mess-"+i+" .supprimer").addEventListener('click', (e) => {
				console.log('[supprimer]');
				console.log($("#mess-"+i));
				// todo : requete vers le serveur pour supprimer la contrib (delete ?)
			});
	
			$("#mess-"+i+" .modifier").addEventListener('click', (e) => {
				console.log('[modifier]');
				console.log($("#mess-"+i));
				// todo: faire apparaitre une popup pour la modification ?
				// todo: requete vers le serveur pour modifier la contrib
			});
		}

	});
}


// affiche la liste complète des sujet d'un débat
function afficherListeTopic(State){
	
	triDebats(State);

	const html = $("#liste-debat-overview .scrollbox");

    // todo: générer liste topic ???
	html.innerHTML = State.topics.reduce((acc, sujetDebat) => {
		acc += genererTopicOverview(sujetDebat);
		return acc;
	}, "");

    // pose des écouteurs sur les topics
	State.topics.forEach((debat) => {
		// au clic, on affiche le débat
		$("#_"+debat._id).addEventListener('click', () => {
			afficherDebat(debat);
			State.currentTopic = debat._id;
		});
	});

}