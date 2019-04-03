/*jshint esversion: 9 */


// =====================================
// event listener sur contenu statique
// =====================================
document.addEventListener('DOMContentLoaded', () => {

	// MENU HAMBURGER
	$("#mobile-menu").addEventListener('click', () => {
		if($("#liste-debat-overview").style.left === "0px"){
			$("#liste-debat-overview").style.left = "-100vw";
		} else {
			$("#liste-debat-overview").style.left = "0px";
		}
	});

	// DARKEN
	$("#darken").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'none';
		$("#darken").style.display = 'none';
		$("#creation-debat").style.display = 'none';
	});


	// SAISIE CLEF API
	// connexion
	$("#connexion").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'block';
		$("#darken").style.display = 'block';
	});

	// annuler
	$("#connexion-popup #annuler").addEventListener('click', () => {
		$("#connexion-popup").style.display = 'none';
		$("#darken").style.display = 'none';
	});

    

	// valider
	$("#connexion-popup #valider").addEventListener('click', () => {
		const key = $("#clef-api").value;
		if(key !== ""){
			$("#connexion-popup").style.display = 'none';
			$("#darken").style.display = 'none';
			State.api_key_value = key;
		}
	});


	// CREATION D'UN DEBAT
	// fab
	$(".fab").addEventListener('click', () => {
		$("#creation-debat").style.display = 'block';
		$("#darken").style.display = 'block';
	});

	// publier
	$("#publier").addEventListener('click', () => {
		const topic = $("#topic-debat").value;
		const content = $("#content-debat").value;

		if(topic !== "" && content !== ""){
			console.log(topic, content);
			
			$("#creation-debat").style.display = 'none';
			$("#darken").style.display = 'none';

			$("#topic-debat").value = "";
			$("#content-debat").value = "";
	
      // TODO: requête PUT vers le serveur (+ déplacer les deux lignes dans le .then)
		}
	});

	// annuler
	$("#creation-debat #annuler").addEventListener('click', () => {
		$("#creation-debat").style.display = 'none';
		$("#darken").style.display = 'none';
		$("#topic-debat").value = "";
		$("#content-debat").value = "";
	});


	// CONTRIBUTION A UN DEBAT
	$("#ajouter-message").addEventListener('keyup', function(e){
		if(e.which === 13){
			const content = $("#ajouter-message").value;
			if(content !== ""){
				console.log(content);
				$("#ajouter-message").value = "";

				// TODO: requete PUT vers le serveur
			}
		}
	});


	// RECHERCHE
	$("#recherche-text").addEventListener('keyup', (e) => {
		const query = $("#recherche-text").value;
		const topics = State.topics;
        State.topics = State.topics.filter((e) => (e.desc.indexOf(query) != -1 || e.topic.indexOf(query) != -1));
		afficherListeTopic(State);
        State.topics = topics;
	});



	// TRIER
	$("#trier-value").addEventListener('change', (e) => {
		const sort = $("#trier-value").value;
		State.sort = sort;
		afficherListeTopic(State);
    });
    
    $("#trier-order").addEventListener('change', (e) => {
		const order = $("#trier-order").value;
		State.order = order;
		afficherListeTopic(State);
	});

});
