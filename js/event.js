/*jshint esversion: 9 */


// =====================================
// event listener sur contenu statique
// =====================================
window.addEventListener('load', () => {

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
			s.api_key_value = key;
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
			
			request('topic/create', s, "POST", true, {'topic': topic, 'desc':content, 'open':true})
			.then((response) => {
				if(response.date === undefined){
					alert("Quelque chose s'est mal passé !"); // todo: better ui
				} else {
					$("#creation-debat").style.display = 'none';
					$("#darken").style.display = 'none';		
					$("#topic-debat").value = "";
					$("#content-debat").value = "";		
					getData(s);
				}

			})
			.catch(() => {
				alert("Erreur réseau !");
			});

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
				request("topic/" + s.currentTopic+ "/post/create ", s, "POST", true, {content: content})
				.then((response) => {
					if(response.content === undefined){
						alert("Quelque chose s'est mal passé !");
					} else {
						$("#ajouter-message").value = "";
						getData(s);
					}
				});
			}
		}
	});


	// RECHERCHE
	$("#recherche-text").addEventListener('keyup', (e) => {
		const query = $("#recherche-text").value;
		const topics = s.topics;
		s.topics = s.topics.filter((e) => (e.desc.indexOf(query) != -1 || e.topic.indexOf(query) != -1));
		afficherListeTopic(s);
		s.topics = topics;
	});

	// TRIER
	$("#trier-value").addEventListener('change', (e) => {
		const sort = $("#trier-value").value;
		s.sort = sort;
		afficherListeTopic(s);
    });
    
    $("#trier-order").addEventListener('change', (e) => {
		const order = $("#trier-order").value;
		s.order = order;
		afficherListeTopic(s);
	});



	// VERROUILLER UN DEBAT
	$("#lock-debat i").addEventListener('click', () => {
		if($("#lock-debat i").style.cursor === "pointer"){
			request("topic/"+s.currentTopic+"/clopen", s, "PUT", true)
			.then((response)=>{
				console.log(response); // todo
				getData(s);
			});
		}
	});



	// SUPPRIMER UN DEBAT
	$("#delete-debat i").addEventListener('click', () => {
		if($("#delete-debat i").style.cursor === "pointer"){
			request("topic/"+s.currentTopic+"/delete", s, "DELETE", true)
			.then((response)=>{
				console.log(response); // todo
				getData(s);
			});
		}
	});
	

	// EDITER UN DEBAT

});
