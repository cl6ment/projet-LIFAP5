/*jshint strict: global*/
/*jshint esversion: 8*/
/*jshint browser: true */
/*jshint devel: true */
/*jshint eqeqeq: true*/
/*jshint undef:true*/
/*global triContribs, $, refreshCurrentTopic, genererListeContributions, genererDetailDebat, request, genererTopicOverview, triDebats*/
"use strict";


// ======================================================
// rendu du HTML, pose d'écouteur
// =====================================================

/**
 * @desc Affiche un débat et la liste de ses contribution
 * @param {*} debat un objet contenant le debat a afficher
 */
function afficherDebat(state, debat){

	triContribs(state);

	const lock = $("#lock-debat i");
	const remove = $("#delete-debat i");
	const ajouter = $("#edit-debat i");

	// afficher le débat & ses contributions sur le panneau de droite
	$("#debat-detailview #sujet").innerHTML = genererDetailDebat(debat);
	$("#messages").innerHTML = genererListeContributions(state, debat);
	
	// désactiver l'ajout de contributions sur les sujet clos
	if(debat.open === false){
		ajouter.disabled = true;
		lock.style.backgroundColor = "#E57373";
	} else {
		ajouter.disabled = false;
		lock.style.backgroundColor = "#81C784";
	}

	if(debat.user !== state.user){
		lock.style.cursor = "not-allowed";
		remove.style.cursor = "not-allowed";
		ajouter.style.cursor = "not-allowed";
	} else {
		lock.style.cursor = "pointer";
		remove.style.cursor = "pointer";
		ajouter.style.cursor = "pointer";
	}


	

	// écouteurs sur les contributions d'un débat
	debat.contributions.forEach((_, i) => {
		$("#post-"+i+" .dislike").addEventListener('click', () => {
			const postID = $("#post-"+i).getAttribute('postID');
			request("topic/" + state.currentTopic + "/post/" + postID + "/dislike", state, true, "PUT")
			.then(() => refreshCurrentTopic(state, state.currentTopic, state.currentTopicID));
		});

		$("#post-"+i+" .like").addEventListener('click', () => {
			const postID = $("#post-"+i).getAttribute('postID');
			request("topic/" + state.currentTopic + "/post/" + postID + "/like", state, true, "PUT")
			.then(() => refreshCurrentTopic(state, state.currentTopic, state.currentTopicID));
		});

		// désactive les event listener pour les commentaires autre que les siens
		if($("#post-"+i+" .supprimer") !== null){
			$("#post-"+i+" .supprimer").addEventListener('click', () => {
				const postID = $("#post-"+i).getAttribute('postID');
				request("topic/" + state.currentTopic + "/post/" + postID + "/delete", state, true, "DELETE")
				.then(() => refreshCurrentTopic(state, state.currentTopic, state.currentTopicID));
			});
		}

	});

	return state;
}


// 


/**
 * @desc affiche la liste complète des sujet d'un débat
 * @param {*} state le state de l'application
 */
function afficherListeTopic(state){
	triDebats(state);

	const html = $("#liste-debat-overview .scrollbox");

	html.innerHTML = state.topics.reduce((acc, sujetDebat) => {
		acc += genererTopicOverview(sujetDebat);
		return acc;
	}, "");


	// update la view du débat
	if(state.topics.length !== 0 && state.currentTopic === ""){
		state.currentTopic = state.topics[state.currentTopicID]._id;
		afficherDebat(state, state.topics[state.currentTopicID]);	
	}

    // pose des écouteurs sur les topics
	state.topics.forEach((debat, i) => {
		// au clic, on affiche le débat

		$("#_"+debat._id).addEventListener('click', () => {

			state.topics.forEach((d) => {$("#_"+d._id + " .sujet").style.color = "#616161";});

			$("#_"+debat._id + " .sujet").style.color = "var(--accent-blue)";

			state.currentTopic = debat._id;
			state.currentTopicID = i;
			afficherDebat(state, debat);
		});
	});

	return state;
}