/*jshint esversion: 9 */


const TOPIC_LOCAUX = './json/Projet-2019-topics.json';
const USERS_LOCAUX = './json/Projet-2019-users.json';
const SERVEUR = 'http://lifap5.univ-lyon1.fr/';



const api_header = "x-api-key";
const api_key_value = "721d9481-6403-515d-a230-7c31566e33ab";
let headers = new Headers();
headers.set(api_header, api_key_value);
headers.set("Content-Type", "application/json");


function whoami(){
	const url = "http://lifap5.univ-lyon1.fr/" + "user/whoami";
	return fetch(url, { method: "GET", headers: headers })
	.then(function(response) {
		if (response.ok) {
			console.log(response.json());
			// return response.json();
		} else {
			throw(`Erreur dans la requete ${url}: ${response.code}`);
		}
	})
	.catch(reason => console.error(reason));
}

// whoami();



// todo: remplacer le let state par la fonction state
function State(users = [], topics = [], filters = [], sort = "date", order = "desc", key = ""){
	this.users   = users;
	this.topics  = topics.map(x => ({...x, date : new Date(x.date)})); // why add the date ?
	this.filters = filters;
	this.sort    = sort;
	this.order   = order;
	this.key 	 = key;
}


// chargement initial des données
request(TOPIC_LOCAUX)
.then((data) => {
	
	State.topics = data;
	State.sort = "date";
	State.order = "desc";
	
	afficherListeTopic(State);
})
.catch((e) => {
	console.log("Il y a eu une erreur !", e);
});



