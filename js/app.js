/*jshint esversion: 9 */

// const server = "https://lifap5.univ-lyon1.fr:8443/";
const server = "https://lifap5.univ-lyon1.fr/";
const api_key_value = "dbe5d1c1-4630-57d1-bf6a-dbd746c58565";

// topics = [], sort = "date", order = "desc", key = "", user = ""
function State(topics = [], sort = "date", order = "desc", key = "", user = ""){
	this.topics = topics;
	this.sort = sort;
	this.order = order;
	this.api_key_value = key;
	this.user = user;
	this.currentTopic = "";
	this.currentTopicID = 0;
}
let s = new State(); // wut?
s.api_key_value = api_key_value; // uniquement pour les tests !


async function getTopicsIds(state){
	return await request('topics/', state);
}

async function getTopicContent(state, id){
	return await request('topics/'+id, state);
}

async function getPostInTopic(state, id){
	return await request("topic/"+id+"/posts", state);
}

function whoami(state){
	request("user/whoami", state, "GET", true)
	.then((whoami) => {
		state.user = whoami;
	});
}



function getData(s){
	getTopicsIds(s)
	.then(function(data){
		return data;
	})
	.then(function(listeTopic){
		let tab = [];
		listeTopic.forEach((topic)=>{
			tab.push(getTopicContent(s, topic._id));
		});
		return tab;
	})
	.then(function(topic){
		return Promise.all(topic);
	})
	.then(function(listeTopic){
		s.topics = listeTopic;
		let tab = [];
		listeTopic.forEach((topic)=>{
			tab.push(getPostInTopic(s, topic._id));
		});
		return tab;
	})
	.then(function(listePosts){
		return Promise.all(listePosts);
	}).then(function(listePosts){

		listePosts.forEach((v, i) => {
			s.topics[i].contributions = v;
		});

		afficherListeTopic(s);
	});
}


getData(s);
whoami(s);



// getTopicsIds(s)
// .then(function(data){
// 	return data;
// })
// .then(function(listeTopic){
// 	let tab = [];
// 	listeTopic.forEach((topic)=>{
// 		tab.push(getTopicContent(s, topic._id));
// 	});
// 	return tab;
// })
// .then(function(topic){
// 	return Promise.all(topic);
// })
// .then(function(listeTopic){
// 	s.topics = listeTopic;
// 	let tab = [];
// 	listeTopic.forEach((topic)=>{
// 		tab.push(getPostInTopic(s, topic._id));
// 	});
// 	return tab;
// })
// .then(function(listePosts){
// 	return Promise.all(listePosts);
// }).then(function(listePosts){

// 	listePosts.forEach((v, i) => {
// 		s.topics[i].contributions = v;
// 	});

// 	afficherListeTopic(s);
// })
// .then(function(){
// 	return whoami(s);
// }).then(function(whoami){
// 	s.user = whoami;
// });