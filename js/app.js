/* global downloadPromise uploadPromise resetPromise updatePromise */
/* see http://eslint.org/docs/rules/no-undef */

/************************************************************** */
/* CONSTANTES */
/************************************************************** */

const base_url = "http://lifap5.univ-lyon1.fr/";
const local_todos = "./Projet-2018-todos.json";
const local_users = "./Projet-2018-users.json";


////////////////////////////////////////////////////////////////////////////////
// ETAT : classe d'objet pour gérer l'état courant de l'application
////////////////////////////////////////////////////////////////////////////////

function State(users = [], todos = [], filters = [], sort = "NONE"){
  this.users  = users;
  this.todos  = todos;
  this.filters = filters;
  this.sort   = sort;

  //returns the JSON object of a user
  this.get_user_info = (user_id) => {    
    return this.users.find((o)=>o['_id']===user_id);
  };

  //returns the TODO objects created by a user
  this.get_user_todos = (user_id) => {
    console.debug(`get_user_todos(${user_id})`); // with ${this.todos}
    const result = this.todos.filter( o => o['createdBy']===user_id );
    return result;
  };

  //returns the TODO objects where a user is mentioned
  this.get_mentioned_todos = (user_id) => {
    let mentioned_todos = [];
    return mentioned_todos;
  };
}//end State


////////////////////////////////////////////////////////////////////////////////
// OUTILS : fonctions outils, manipulation et filtrage de TODOs
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// RENDU : fonctions génération de HTML à partir des données JSON
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// HANDLERS : gestion des évenements de l'utilisateur dans l'interface HTML
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// FETCH Fonction permettant de charger des données asynchrones
////////////////////////////////////////////////////////////////////////////////
function get_local_todos() {
  return fetch(local_todos)
    .then(response => response.text())
}

function get_local_users() {
  return fetch(local_users)
    .then(response => response.text())
}


/************************************************************** */
/** MAIN PROGRAM */
/************************************************************** */
document.addEventListener('DOMContentLoaded', function(){
  // garde pour ne pas exécuter dans la page des tests unitaires.
  if (document.getElementById("title-test-projet") == null) {

    Promise.all([get_local_users(),get_local_todos()])
    .then(values => values.map(JSON.parse))
    .then(values => new State(values[0], values[1]))
    .then(state => state.get_user_todos('romuald'))
    .then(todos => todos.map(x => x['title']))
    .then(todos => console.log(todos))
    .catch(reason => console.error(reason));
  }
}, false);
