/*jshint strict: global*/
/*jshint esversion: 8*/
/*jshint browser: true */
/*jshint devel: true */
/*jshint eqeqeq: true*/
/*jshint undef:true*/
/*global  getTopicsId, getTopicContent, getPostContent, eventListener, afficherListeTopic, $, afficherDebat, statelessEventListener*/
"use strict";

const server = "https://lifap5.univ-lyon1.fr/";
let socket = new WebSocket("wss://lifap5.univ-lyon1.fr:443/stream/");



// state
function State(
		topics = [], 
		x_api_key="", 
		user="", 
		sort="date", 
		order="desc", 
		sortContrib="date",
		sortContribOrder="desc",
		search = "", 
		currentTopic = "", 
		currentTopicID=0){
	this.topics = topics;
	this.sort = sort;
	this.order = order;
	this.sortContrib = sortContrib;
	this.sortContribOrder = sortContribOrder;
	this.search = search;
	this.user = user;
	this.x_api_key = x_api_key;
	this.currentTopic = currentTopic;
	this.currentTopicID = currentTopicID;
}

// get Data
function getData(_state=""){
	return getTopicsId()
	.then((data) => {
		let listeTopics = [];
		let listePosts = [];
			data.forEach((val) => {
			listeTopics.push(getTopicContent(val._id));
			listePosts.push(getPostContent(val._id));
		});
			return Promise.all([...listeTopics, ...listePosts]);
	})
	.then((data) => {
		const size = data.length/2;
		let topics = data.slice(0, size);
		
		topics.forEach((_, i) => {
			topics[i].contributions = data[size + i];
		});

		return topics;
	})
	.then(topics => new State(
			topics, 
			_state.x_api_key, 
			_state.user, 
			_state.sort, 
			_state.order, 
			_state.sortContrib,
			_state.sortContribOrder,
			_state.search, 
			_state.currentTopic, 
			_state.currentTopicID)) // on passe les anciens paramètres qu'on veut sauvegarder
	.then((state) => eventListener(state))
	.then((state) => afficherListeTopic(state))
	.then((state) => {
		socket.onmessage = (e) => {
			getData(state);
			console.log("websocket message !");
			console.log(e);
		};
		return state;
	});
}


// refresh only topic whose _id is given in parameter
function refreshCurrentTopic(_state, _id, _index){

	return Promise.all([getTopicContent(_id), getPostContent(_id)])
	.then((data) => {
		
		_state.currentTopic = _id;
		_state.currentTopicID = _index;
		_state.topics[_index] = data[0];
		_state.topics[_index].contributions = data[1];

		return _state;
	})
	.then((state) => eventListener(state))
	.then((state) => afficherDebat(state, state.topics[state.currentTopicID]));
}








// "main"
document.addEventListener("DOMContentLoaded", () => {
	if($("#mocha") === null){
		statelessEventListener();
		getData();	
	}

	window.addEventListener('beforeunload', () => {
		socket.close();
	});
});