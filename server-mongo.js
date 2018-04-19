/*
	LANCER DOCKER
	
	Pour créer le conteneur:
	docker run -d --name test-mongo -p 27017:27017 mongo
	docker exec -it test-mongo mongo
	
	Si le conteneur est déja créer mais pas starter
	docker container start <nom-du-container>
	docker exec-it <nom-du-container> mongo
*/

// Importation des modules externes
const express = require("express"); // Module JS permettant de créer des endpoints HTTP facilement
const bodyParser = require("body-parser"); // Module JS permettant de tranformer les paramètres en JSON
const auth = require("./auth"); // Module permettant de gérer l'authentification par secret partagé pour notre API REST

const mongo = require("./mongo");

// mongo.remove(1, (isOkay) => { console.log(isOkay ? 'Supprimé !': 'Erreur !')});

/*
  Paramètrage d'Express. Pas besoin de toucher.
  ------------------------------------------------
*/
// Paramètrage de Express
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  next();
});

// Activier l'authentification par secret partagé
// Nécessite d'ajouter -H 'secret: 7cTcjNyVJyudBqfE' a chaque commande curl
app.use(auth)

/*
  ------------------------------------------------
*/




/*
  Déclaration des endpoints (également appelés *routes*)

  req: Contient toutes les données de la requête reçue: headers, paramètres GET, paramètres POST etc..
  res: Contient des fonctions permettant de répondre à la requête

  Obtenir les paramètres GET: req.query
  Obtenir les paramètres POST: req.body
  Obtenir les "paramètres" dans l'URL: req.params
  Répondre un message text: res.send("Okay, bien reçu")
  Répondre avec un object jSON: res.json({message: "Okay, bien reçu"})
*/
// Lorsqu'on reçoit une requête GET
// Exemple: curl localhost:8080/?index=3
// TODO: Retourner l'item correspondant à l'index envoyé dans la requête
// curl localhost:8080/?index=0 -H 'secret: 7cTcjNyVJyudBqfE'
app.get("/", (req, res) => {
  const paramsGet = req.query; // {index: "3"}
  
   mongo.get(paramsGet.index, (item) => { res.send(item); }) // Renvoi l'item n°X
  
});

// Lorsqu'on reçoit une requête POST
// Exemple: curl -X POST -H "Content-Type: application/json" localhost:8080 -d '{"title":"Mon titre", "content": "mon contenu"}'
// Exemple: curl -X POST -H "Content-Type: application/json" localhost:8080 -d '{"title":"Super titre3", "content": "super contenu3"}' -H 'secret: 7cTcjNyVJyudBqfE'
// TODO: Sauvegarder l'item reçu dans le tableau des items
app.post("/", (req, res) => {
	const paramsPost = req.body; // {title: "Mon titre"}

	const nouvelArticle = {
		title: paramsPost.title,
		content: paramsPost.content,
	};
	
	mongo.add( nouvelArticle, (isOkay) => {
		if(isOkay){
			console.log('ajouté');
			res.send('Ajouté ! \n')
		}else{
			console.log('erreur');
			res.send('Erreur ! \n')
		}
	})

});

// Lorsqu'on reçoit une requête DELETE
// Exemple: curl -X DELETE localhost:8080/6
// TODO: Supprimer l'item correspondant à l'index envoyé en paramètre d'URL
// Exemple: curl -X DELETE localhost:8080/4 -H 'secret: 7cTcjNyVJyudBqfE'
app.delete("/:number", (req, res) => {
	const paramsURL = req.params; //  {number: 6}
	console.log({ paramsURL });
	// Supprimer un élément d'un tableau

	mongo.remove(parseInt(paramsURL.number), (isOkay) => { 
		if(isOkay){
			console.log('supprimé');
			res.send('Supprimé ! \n')
		}else{
			console.log('erreur');
			res.send('Erreur ! \n')
		}
	});
	
	res.json(paramsURL);
});

// Lorsqu'on reçoit une requête PUT
// Exemple: curl -X PUT -H "Content-Type: application/json" localhost:8080/?index=2 -d '{"newTitle":"Mon nouveau titre"}'
// TODO: Modifier l'item correspondant à l'index reçu en paramètre GET avec les données reçues en paramètre POST
// Exemple: curl -X PUT -H "Content-Type: application/json" localhost:8080/?index=0 -d '{"newTitle":"Mon nouveau titre", "newContent": "mon nouveau contenu"}' -H 'secret: 7cTcjNyVJyudBqfE'

app.put("/", (req, res) => {
	// La variable paramsGet récupère les paramètre GET inséré après l'url lors de la commande curl
	// p.ex: localhost:8080/?index=2 --> paramsGet contiendra {index: 2}
	const paramsGet = req.query; // {index: 2}
	// La variable paramsPost récupère les paramètres POST inséré lors de la commande curl
	// p.ex: -d '{"newTitle":"Mon nouveau titre"}' --> paramsPost contiendra {newTitle: "Mon nouveau titre"}
	const paramsPost = req.body; // {newTitle: "Mon nouveau titre", newContent: "Nouveau contenu"}
	
	// Ici on modifie la valeur de title pour l'element du tableau à l'index défini dans la commande curl
	// Pour la commande suivante: curl -X PUT -H "Content-Type: application/json" localhost:8080/?index=2 -d '{"newTitle":"Mon nouveau titre"}'
	// Cela equivaut à faire ca-> data.items[2].title="Mon nouveau titre";
	
	const updateItem = {
		title: paramsPost.newTitle,
		content: paramsPost.newContent,
	};
	
	mongo.update(paramsGet.index, updateItem, (isOkay) => { 
		if(isOkay){
			console.log('mis à jour');
			res.send('Mis à jour ! \n')
		}else{
			console.log('erreur');
			res.send('Erreur ! \n')
		}
	});

	res.json(paramsPost);

});

/*
  Lancement du serveur sur le port 8080
*/
app.listen(8080, () => console.log(`Listen on port 8080`));
