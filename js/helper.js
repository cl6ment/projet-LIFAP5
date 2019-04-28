/*jshint esversion: 9 */

// jquery lol
const $ = (e) => document.querySelector(e);


// fetch, but supercharged
async function request(path, state, auth=false, method="GET", p={}){
    
    let header  = new Headers({
        'Content-Type':'application/json'
    });
    
    if(auth){
        header = new Headers({
            'x-api-key': state.x_api_key,
            'Content-Type':'application/json'
        });
    }
    let payload = {method: method, headers: header};
    
    if(Object.values(p).length != 0)
        payload.body = JSON.stringify(p);      
    
    const url = server + path;
    const response = await fetch(url, payload);
    
	if(response.ok){
		return await response.json();
	} else {
		throw `[${response.status}] status code`;
	}

}


// évite les eventlisteners multiples
function deleteEventListener(e){
	let elt = $(e);
	const clone = elt.cloneNode(true);
	elt.parentNode.replaceChild(clone, elt);
}

// requetes réseau
function whoami(state){
    return request("user/whoami", state, true);
}
function getTopicsId(){
    return request("topics/");
}
function getTopicContent(id){
	return request("topic/"+id);
}
function getPostContent(id){
	return request("topic/"+id+"/posts");
}



// action utilisateur
function getKey(state){
    const key = $("#clef-api").value;
    if(key !== ""){
        $("#connexion-popup").style.display = 'none';
        $("#darken").style.display = 'none';
        state.x_api_key = key;
        whoami(state).then((resp) => {state.user=resp.login; afficherDebat(state, state.topics[state.currentTopicID]);});
    }
}
function search(state){
    const query = $("#recherche-text").value;
    const topics = state.topics;
    if(query !== ""){
        state.topics = state.topics.filter((e) => (e.desc.indexOf(query) != -1 || e.topic.indexOf(query) != -1));
    }
    afficherListeTopic(state);
    state.topics = topics;
}
function addTopic(state){
    const topic = $("#topic-debat").value;
    const content = $("#content-debat").value;

    if(topic !== "" && content !== ""){
        request('topic/create', state, true, "POST", {'topic': topic, 'desc':content, 'open':true})
        .then((response) => {
            if(response.date === undefined){
                alert("Quelque chose s'est mal passé !"); // todo: better ui
            } else {
                $("#creation-debat").style.display = 'none';
                $("#darken").style.display = 'none';		
                $("#topic-debat").value = "";
                $("#content-debat").value = "";		
                getData(state);
            }
        });
    }
}
function sortTopic_order(state){
    const order = $("#trier-order").value;
    state.order = order;
    afficherListeTopic(state);
}
function sortTopic_value(state){
    const sort = $("#trier-value").value;
    state.sort = sort;
    afficherListeTopic(state);
}

function sortContrib_order(state){
    const order = $("#sort-debat-order").value;
    state.sortContribOrder = order;
    afficherDebat(state, state.topics[state.currentTopicID]);
}
function sortContrib_value(state){
    const sort = $("#sort-debat").value;
    state.sortContrib = sort;
    afficherDebat(state, state.topics[state.currentTopicID]);
}


function lockDebat(state){
    if($("#lock-debat i").style.cursor === "pointer"){
        request("topic/"+state.currentTopic+"/clopen", state, true, "PUT")
        .then(() => refreshCurrentTopic(state, state.currentTopic, state.currentTopicID));
    }
}   
function deleteDebat(state){
    if($("#delete-debat i").style.cursor === "pointer"){
        request("topic/"+state.currentTopic+"/delete", state, true, "DELETE")
        .then(() => getData(state));
    }
}
function editDebat(state){
    const topic = state.topics[state.currentTopicID];
    if(state.user === topic.user){
        const newDesc = prompt("Modifiez le contenu: ", topic.desc);
        if(newDesc !== null){
            request("topic/"+topic._id+"/update", state, true, "PUT", {'topic': topic.topic, 'desc': newDesc, 'open':topic.open});
            refreshCurrentTopic(state, state.currentTopic, state.currentTopicID);
        }
    }
}
function addPost(state, e){
    if(e.which === 13){
        const content = $("#ajouter-message").value;
        if(content !== ""){
            request("topic/" + state.currentTopic+ "/post/create ", state, true, "POST", {content: content})
            .then((response) => {
                if(response.content === undefined){
                    alert("Quelque chose s'est mal passé !");
                } else {
                    $("#ajouter-message").value = "";
                    getData(state);
                }
            });
        }
    }
}


// state-dependent listeners (</3)
function eventListener(state){
    
    [
        "#connexion-popup #valider",
        "#creation-debat #publier",
        "#recherche-text",
        "#trier-value",
        "#trier-order",
        "#publier",
        "#ajouter-message",
        "#delete-debat i",
        "#lock-debat i",
        "#edit-debat i",
        "#sort-debat",
        "#sort-debat-order",
    ].map((e) => deleteEventListener(e));
    

	$("#recherche-text").addEventListener('keyup', () => search(state));
	$("#connexion-popup #valider").addEventListener('click', () => getKey(state));
    $("#creation-debat #publier").addEventListener("click", () => addTopic(state));
    $("#trier-value").addEventListener('change', () => sortTopic_value(state));
    $("#trier-order").addEventListener('change', () => sortTopic_order(state));
    $("#ajouter-message").addEventListener('keyup', (e) => addPost(state, e));
    $("#delete-debat i").addEventListener('click', () => deleteDebat(state));
    $("#lock-debat i").addEventListener('click', () => lockDebat(state));
    $("#edit-debat i").addEventListener('click', () => editDebat(state));
    $("#sort-debat").addEventListener('change', () => sortContrib_value(state));
    $("#sort-debat-order").addEventListener('change', () => sortContrib_order(state));
    return state;
}



// state-independent listeners (<3)
function statelessEventListener(){
    $("#connexion").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'block';
		$("#darken").style.display = 'block';
	});
	$("#connexion-popup #annuler").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'none';
		$("#darken").style.display = 'none';
	});

	$("#mobile-menu").addEventListener('click', () => {
		if($("#liste-debat-overview").style.left === "0px"){
			$("#liste-debat-overview").style.left = "-100vw";
		} else {
			$("#liste-debat-overview").style.left = "0px";
		}
	});
	$("#darken").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'none';
		$("#darken").style.display = 'none';
		$("#creation-debat").style.display = 'none';
	});

	$(".fab").addEventListener('click', () => {
		$("#creation-debat").style.display = 'block';
		$("#darken").style.display = 'block';
	});

	$("#creation-debat #annuler").addEventListener('click', () => {
		$("#creation-debat").style.display = 'none';
		$("#darken").style.display = 'none';
		$("#topic-debat").value = "";
		$("#content-debat").value = "";
	});
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
                if(da.getHours() > db.getHours()){
                    return 1;
                } else if(da.getHours() < db.getHours()){
                    return -1;
                } else {
                    if(da.getMinutes() > db.getMinutes()){
                        return 1;
                    } else if(da.getMinutes() < db.getMinutes()){
                        return -1;
                    } else {
                        if(da.getSeconds() > db.getSeconds()){
                            return 1;
                        } else if(da.getSeconds() < db.getSeconds()){
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                }
            }
        }
    }

}





/**
 * @desc Tri les débat suivant les paramètres du state
 * @param {*} state 
 * @return void
 */
function triDebats(state){
    // tri par date
	if(state.sort === "date"){
        let sort = (a,b) => compareDate(b,a);
        
        if(state.order === "asc")
            sort = (a,b) => compareDate(a,b);

		state.topics = state.topics.sort((a, b) => {
            return sort(a.date, b.date);
        });
    }
    
    // tri par topic (le titre du débat)
    if(state.sort === "topic"){
        let sort = (a, b) => ((a.topic > b.topic) ? -1 : 1);

        if(state.order === "asc")
            sort = (a, b) => ((a.topic > b.topic) ? 1 : -1);
        
        state.topics = state.topics.sort(sort);
    }
    
    // tri par nombre de contribution
    if(state.sort === "nbcontrib") {
        let sort = (a, b) => ((a.contributions.length > b.contributions.length) ? -1 : 1);
        
        if(state.order === "asc")
            sort = (a, b) => ((a.contributions.length > b.contributions.length) ? 1 : -1);
        
        state.topics = state.topics.sort(sort);
    }
    
    // tri par date de dernière contribution
    if(state.sort === "lastcontrib"){
        let sort = (a,b) => compareDate(b,a);

        if(state.order === "asc")
            sort = (a,b) => compareDate(a,b);
        
		state.topics = state.topics.sort((a, b) => {
            a = recupDateDerniereActivite(a.contributions);
            b = recupDateDerniereActivite(b.contributions);
            return sort(a,b);
        });
    }

}



function triContribs(_state){
    const _id = _state.currentTopicID;
    
    // tri par date
	if(_state.sortContrib === "date"){
        let sort = (a, b) => compareDate(b, a);
        
        if(_state.sortContribOrder === "asc")
            sort = (a, b) => compareDate(a, b);

        _state.topics[_id].contributions = _state.topics[_id].contributions
        .sort((a, b) => {
            return sort(a.date, b.date);
        });
    }
    

    // tri par nom
    if(_state.sortContrib === "nom"){
        let sort = (a, b) => ((a > b) ? -1 : 1);

        if(_state.sortContribOrder === "asc")
            sort = (a, b) => ((a > b) ? 1 : -1);
        
        _state.topics[_id].contributions = _state.topics[_id].contributions
        .sort((a, b) => {
            return sort(a.user, b.user);
        });
    }
    
    // tri par nombre de contribution
    if(_state.sortContrib === "nblikes"){
        let sort = (a, b) => ((a.length > b.length) ? -1 : 1);
        
        if(_state.sortContribOrder === "asc")
            sort = (a, b) => ((a.length > b.length) ? 1 : -1);
        
        _state.topics[_id].contributions = _state.topics[_id].contributions
        .sort((a, b) => {
            return sort(a.likers, b.likers);
        });    
    }

    if(_state.sortContrib === "nbdislikes"){
        let sort = (a, b) => ((a.length > b.length) ? -1 : 1);
        
        if(_state.sortContribOrder === "asc")
            sort = (a, b) => ((a.length > b.length) ? 1 : -1);
        
        _state.topics[_id].contributions = _state.topics[_id].contributions
        .sort((a, b) => {
            return sort(a.dislikers, b.dislikers);
        });    
    }


}