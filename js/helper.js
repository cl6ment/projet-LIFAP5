/*jshint esversion: 9 */



/**
 * @desc Raccourci syntaxique pour le sélecteur universel (NOT JQUERY!)
 * @param {*} s une string commencant par # pour les id et . pour les classes
 * @return Un objet js lié au DOM
 */
function $(s){
	return document.querySelector(s);
}






/**
 * @desc
 * @param {*} url 
 * @param {*} typeRetour 
 * @return 
 */
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






/**
 * @desc Donne la date de dernière activité sur un débat
 * @param {*} contrib la liste des contributions au débat
 * @return renvoit la date de dernière activité du débat, et false dans le cas où il n'y a eu aucune activité
 */
function recupDateDerniereActivite(contrib){
	if(contrib.length > 0){
		return contrib[contrib.length-1].date;
	} else {
		return false;
	}
}






/**
 * @desc Transforme une date js dans un format lisible et plaisant
 * @param {*} d une date au format renvoyé par le constructeur new Date()
 * @return "Jamais" si la date n'a pas un format correct, une date au format jj/mm/yyyy sinon
 */
function transformeDate(d){
	if(d === false){
		return "Jamais";
	} else {		
		d = new Date(d);
		return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
	}
}






/**
 * @desc Effectue la comparaison entre deux dates
 * @param {*} da la première date
 * @param {*} db la deuxième date
 * @return 1 si da > db, -1 si da < db
 */
function compareDate(da, db){
    da = new Date(da);
    db = new Date(db);

    if(isNaN(da)) return -1;
    if(isNaN(db)) return 1;

    if(da.getFullYear() > db.getFullYear()){
        return 1;
    } else if(da.getFullYear() < db.getFullYear()){
        return -1;
    } else {
        if(da.getMonth() > db.getMonth()){
            return 1;
        } else if(da.getMonth() < db.getMonth()){
            return -1;
        } else {
            if(da.getDate() > db.getDate()){
                return 1;
            } else if(da.getDate() < db.getDate()){
                return -1;
            } else {
                return 1; // your pick
            }
        }
    }

}





/**
 * @desc
 * @param {*} State 
 * @return 
 */
function triDebats(State){

    // tri par date
	if(State.sort === "date"){
        let sort = (a,b) => compareDate(b,a);
        
        if(State.order === "asc")
            sort = (a,b) => compareDate(a,b);

		State.topics = State.topics.sort((a, b) => {
            return sort(a.date, b.date);
        });
    }
    
    // tri par topic (le titre du débat)
    if(State.sort === "topic"){
        let sort = (a, b) => ((a.topic > b.topic) ? -1 : 1);

        if(State.order === "asc")
            sort = (a, b) => ((a.topic > b.topic) ? 1 : -1);
        
        State.topics = State.topics.sort(sort);
    }
    
    // tri par nombre de contribution
    if(State.sort === "nbcontrib") {
        let sort = (a, b) => ((a.contributions.length > b.contributions.length) ? -1 : 1);
        
        if(State.order === "asc")
            sort = (a, b) => ((a.contributions.length > b.contributions.length) ? 1 : -1);
        
        State.topics = State.topics.sort(sort);
    }
    
    // tri par date de dernière contribution
    if(State.sort === "lastcontrib"){
        let sort = (a,b) => compareDate(b,a);

        if(State.order === "asc")
            sort = (a,b) => compareDate(a,b);
        
		State.topics = State.topics.sort((a, b) => {
            a = recupDateDerniereActivite(a.contributions);
            b = recupDateDerniereActivite(b.contributions);
            return sort(a,b);
        });
    }

}
