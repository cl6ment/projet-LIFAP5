/*jshint strict: global*/
/*jshint esversion: 8*/
/*jshint browser: true */
/*jshint devel: true */
/*jshint eqeqeq: true*/
/*jshint undef:true*/
/*global transformeDate, recupDateDerniereActivite*/
"use strict";


// ===============================================
// Fonction de génération du HTML
// ===============================================


/**
 * @desc Génère le HTML pour un topic qui sera ensuite placé dans la liste des topics
 * @param {object} debat un objet js contenant le contenu du débat
 * @return {string} une string contenant du HTML
 */
function genererTopicOverview(debat){
	const color = (debat.open === false)?"#E57373":"#66BB6A";

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





/**
 * @desc Génère le HTML de la courte description d'un débat quand ce dernier est sélectionné
 * @param {object} debat Un objet js contenant les informations sur le débat
 * @return Une string contenant du HTML
 */
function genererDetailDebat(debat){
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




/**
 * @desc Génère le HTML pour une contribution particulière à un débat
 * @param {*} state L'état de l'application, nécessaire pour savoir si l'utilisateur à le droit de modifier la contribution
 * @param {*} contrib Un objet js contenant les informations sur la contribution
 * @param {*} i L'index de la contribution dans la liste des contributions
 */
function genererContribution(state, contrib, i){

	const allowModification = (contrib.user === state.user) ? 
	`<div class="supprimer">
		<i class="material-icons">delete</i>
	</div>` : ``;

	const like = (contrib.likers.indexOf(state.user) !== -1) ? "fulfilled" : "";
	const dislike = (contrib.dislikers.indexOf(state.user) !== -1) ? "fulfilled" : "";
	return `
	<div class="message" id="post-${i}" postID="${contrib._id}">

		<div class="user">
			<div class="pseudo">${contrib.user}</div>
			&#8226; 
			<div class="date">${transformeDate(contrib.date)}</div>
		</div>

		<div class="content">${contrib.content}</div>
		<div class="action">

			<div class="like ${like}" title="likers: ${contrib.likers.join(", ")}">
				<i class="material-icons">thumb_up</i>
				<span>${contrib.likers.length}</span>
			</div>
			
			<div class="dislike ${dislike}" title="dislikers: ${contrib.dislikers.join(", ")}">
				<i class="material-icons">thumb_down</i>
				<span>${contrib.dislikers.length}</span>
			</div>
			${allowModification}
		</div>			
	</div>`;
}






/**
 * @desc Génère la liste des contributions pour un débat donné
 * @param {*} State L'état de l'application, nécessaire pour les contributions (permissions, ...)
 * @param {*} debat Le débat dont on veut afficher les contributions
 * @return Une string contenant du HTML
 */
function genererListeContributions(state, debat){
	return debat.contributions.reduce((acc, v, i) => {
		acc += genererContribution(state, v, i);
		return acc;
	}, "");
}
