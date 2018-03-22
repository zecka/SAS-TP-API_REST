// Importation des modules externes
const express = require("express"); // Module JS permettant de créer des endpoints HTTP facilement
const bodyParser = require("body-parser"); // Module JS permettant de tranformer les paramètres en JSON
const auth = require("./auth"); // Module permettant de gérer l'authentification par secret partagé pour notre API REST

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
  Déclaration des données
*/
const data = {
  items: [
    {
      title: "Je suis un titre",
      content: "Je suis un contenu",
    },
    {
      title: "Je suis un paf",
      content: "Je suis un contenu",
    },
    {
      title: "Je suis un gros PAFFF",
      content: "Je suis un contenu",
    },
    {
      title: "Je suis un PAAAAFFF de ouf",
      content: "Je suis un contenu",
    },
  ],
};

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
app.get("/", (req, res) => {
  const paramsGet = req.query; // {index: "3"}
  console.log({ paramsGet });
  const text = `L'index reçu est : ${paramsGet.index}\n`;
  
  // ici la variable paramsGet contient un clé index avec la valeur enrée dans la commande curl
  // p.ex pour curl localhost:8080/?index=3 la variable params get contiendra {index: "3"}
  // paramsGet.index retournera donc "3"
  // Dans ce cas faire data.items[paramsGet.index] revient a faire data.items[3]
  res.send(data.items[paramsGet.index]); // On répond à la requête avec un texte
});

// Lorsqu'on reçoit une requête POST
// Exemple: curl -X POST -H "Content-Type: application/json" localhost:8080 -d '{"title":"Mon titre"}'
// TODO: Sauvegarder l'item reçu dans le tableau des items
app.post("/", (req, res) => {
	const paramsPost = req.body; // {title: "Mon titre"}

	// On définit une variable nouvelArticle avec un contenu en json
	// paramsPost.title contient la valeur de "title" envoyé en Post via la commande curl entrer dans le terminal
	const nouvelArticle = {
		title: paramsPost.title,
	};
	
	// On ajoute un nouvel element au tableau items de la variable data
	data.items.push(nouvelArticle);
	
	res.json(paramsPost);
});

// Lorsqu'on reçoit une requête DELETE
// Exemple: curl -X DELETE localhost:8080/6
// TODO: Supprimer l'item correspondant à l'index envoyé en paramètre d'URL
app.delete("/:number", (req, res) => {
	const paramsURL = req.params; //  {number: 6}
	console.log({ paramsURL });
	// Supprimer un élément d'un tableau
	// delete data.items[paramsURL.number]; // Pas très propre car laisse un emplacement vide
	
	// Ici paramsUrl.number contient la valeur ajouter a la commande curl après le / localhost:8080/<LaValeurIndiquéIci>
	// la fonction filter prend deux paramètre, le premier est l'élément du tableau et la deuxième est son index
	// Cette fonction va donc parcourir tout le tableau et comparer chaque index a la valeur contenu dans la variable paramsURL.number
	// Il garde l'élément si son index n'est pas égale a la valeur passée dans l'url indiqué dans la commande curl
	data.items = data.items.filter((item, index) => index !== parseInt(paramsURL.number)); // Propre mais plus compliqué à comprendre
	console.log(data.items)


	
	res.json(paramsURL);
});

// Lorsqu'on reçoit une requête PUT
// Exemple: curl -X PUT -H "Content-Type: application/json" localhost:8080/?index=2 -d '{"newTitle":"Mon nouveau titre"}'
// TODO: Modifier l'item correspondant à l'index reçu en paramètre GET avec les données reçues en paramètre POST
app.put("/", (req, res) => {
	// La variable paramsGet récupère les paramètre GET inséré après l'url lors de la commande curl
	// p.ex: localhost:8080/?index=2 --> paramsGet contiendra {index: 2}
	const paramsGet = req.query; // {index: 2}
	
	// La variable paramsPost récupère les paramètres POST inséré lors de la commande curl
	// p.ex: -d '{"newTitle":"Mon nouveau titre"}' --> paramsPost contiendra {newTitle: "Mon nouveau titre"}
	const paramsPost = req.body; // {newTitle: "Mon nouveau titre"}
	
	// Ici on modifie la valeur de title pour l'element du tableau à l'index défini dans la commande curl
	// Pour la commande suivante: curl -X PUT -H "Content-Type: application/json" localhost:8080/?index=2 -d '{"newTitle":"Mon nouveau titre"}'
	// Cela equivaut à faire ca-> data.items[2].title="Mon nouveau titre";
	data.items[paramsGet.index].title=paramsPost.newTitle;
  
	res.json(paramsPost);

});

/*
  Lancement du serveur sur le port 8080
*/
app.listen(8080, () => console.log(`Listen on port 8080`));
