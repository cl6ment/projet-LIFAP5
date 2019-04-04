/*jshint esversion: 9 */


// ======================================================
// rendu du HTML, pose d'écouteur
// =====================================================

/**
 * @desc Affiche un débat et la liste de ses contribution
 * @param {*} debat 
 */
function afficherDebat(state, debat){

	const lock = $("#lock-debat i");
	const remove = $("#delete-debat i");
	const ajouter = $("#edit-debat i");

	// afficher le débat & ses contributions sur le panneau de droite
	$("#debat-detailview #sujet").innerHTML = genererDetailDebat(debat);
	$("#messages").innerHTML = genererListeContributions(state, debat);

	// désactiver l'ajout de contributions sur les sujet clos
	if(debat.open === false){
		ajouter.disabled = true;
		lock.style.backgroundColor = "#EF5350";
	} else {
		ajouter.disabled = false;
		lock.style.backgroundColor = "#81C784";
	}

	if(debat.user !== state.user.login){
		lock.style.cursor = "not-allowed";
		remove.style.cursor = "not-allowed";
		ajouter.style.cursor = "not-allowed";
	} else {
		lock.style.cursor = "pointer";
		remove.style.cursor = "pointer";
		ajouter.style.cursor = "pointer";
	}


	

	// écouteurs sur les contributions d'un débat
	debat.contributions.forEach((v, i) => {
		$("#post-"+i+" .dislike").addEventListener('click', (e) => {
			const postID = $("#post-"+i).getAttribute('postID');

			request("topic/" + s.currentTopic + "/post/" + postID + "/dislike", s, "PUT", true)
			.then((response) => {
				console.log(response); // todo
				getData(s);
			});

		});

		$("#post-"+i+" .like").addEventListener('click', (e) => {
			const postID = $("#post-"+i).getAttribute('postID');

			request("topic/" + s.currentTopic + "/post/" + postID + "/like", s, "PUT", true)
			.then((response) => {
				console.log(response); // todo
				getData(s);
			});

		});

		// désactive les event listener pour les commentaires autre que les siens
		if($("#post-"+i+" .supprimer") !== null){
			$("#post-"+i+" .supprimer").addEventListener('click', (e) => {
				const postID = $("#post-"+i).getAttribute('postID');

				request("topic/" + s.currentTopic + "/post/" + postID + "/delete", s, "DELETE", true)
				.then((response) => {
					console.log(response); // todo
					getData(s);
				});

			});
	
			$("#post-"+i+" .modifier").addEventListener('click', (e) => {
				console.log('[modifier]');
				console.log($("#post-"+i).getAttribute('postID'));
				// todo: faire apparaitre une popup pour la modification ?
				// todo: requete vers le serveur pour modifier la contrib
			});
		}

	});
}


// affiche la liste complète des sujet d'un débat
function afficherListeTopic(state){	
	triDebats(state);

	const html = $("#liste-debat-overview .scrollbox");

	html.innerHTML = state.topics.reduce((acc, sujetDebat) => {
		acc += genererTopicOverview(sujetDebat);
		return acc;
	}, "");


	// afficher le premier débat
	state.currentTopic = state.topics[state.currentTopicID]._id;
	afficherDebat(state, state.topics[state.currentTopicID]);


    // pose des écouteurs sur les topics
	state.topics.forEach((debat, i) => {
		// au clic, on affiche le débat
		$("#_"+debat._id).addEventListener('click', () => {
			state.currentTopic = debat._id;
			state.currentTopicID = i;
			afficherDebat(state, debat);
		});
	});

}