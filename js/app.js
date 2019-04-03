/*jshint esversion: 9 */

const server = "https://localhost:8443/";
const api_key_value = "dbe5d1c1-4630-57d1-bf6a-dbd746c58565";
State.api_key_value = api_key_value; // uniquement pour les tests !


function State(users = [], topics = [], filters = [], sort = "date", order = "desc", key = "", user = ""){
	this.users = users;
	this.topics = topics.map(x => ({...x, date : new Date(x.date)})); // why add the date ?
	this.filters = filters;
	this.sort = sort;
	this.order = order;
	this.api_key_value = key;
	this.user = user;
}


request('topics/', State, false).then((response) => {
	response.forEach(function(v){
		// error on server?
		request('topic/'+v._id, State, false).then((response) => {
			console.log(response);
		});
	});
});







// // chargement initial des données
// request(TOPIC_LOCAUX)
// .then((data) => {
	
// 	State.topics = data;
// 	State.sort = "date";
// 	State.order = "desc";
// 	State.user = "clement.herve";
	
// 	afficherListeTopic(State);
// })
// .catch((e) => {
// 	console.log("Il y a eu une erreur !", e);
// });

