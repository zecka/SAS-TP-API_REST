# Installation

1.  Installation de NodeJS: https://nodejs.org/en/download/
2.  Clonage du dépôt: `git clone https://github.com/CREA-Dev/SAS-TP-API_REST tp-api-rest && cd tp-api-rest`
3.  Installation des modules externes: `npm install`

# Lancement

Lancer le serveur avec `node server.js`.
Il est nécessaire de l'arrêter (CTRL+C) et de le relancer à chaque modification.

Pour que le serveur se relance tout seul à chaque modification, vous pouvez utiliser `nodemon`:

```bash
npm install -g nodemon
npm run dev
```

# Exemples

Le fichier [javascript.js](javascript.js) réuni un ensemble d'exemples pour comprendre le fonctionnement de base de javascript.
Il est possible de l'exécuter avec la commande `node javascript.js`.

# Modules

Dans ce dépôt, vous trouverez 2 modules supplémentaires qui seront éventuellement plus tard.
Vous n'en avez pas besoin pour commencer l'exercice.

* `auth.js` pour gérer l'authentification sur les endpoints
* `mongo.js` pour gérer les accès à une base de données MongoDB

# Exercices

## Première partie: variable data

Pour lancer le serveur avec les donnée enregistré dans des variables
```bash
npm run dev
```
## Deuxième partie: MongoDB

Avant toute chose créer le serveur avec Docker
```bash
docker run -d --name <nom-du-container> -p 27017:27017 mongo
docker exec -it <nom-du-container> mongo
```

Si le container existe déjà mais n'est pas starté
```bash
docker container start <nom-du-container>
docker exec-it <nom-du-container> mongo
```

Une fois que le container est actif il faut lancer le serveur node.js relié a mongo
Ouvrir une nouvelle fenêtre de terminal et executer la commande suivante
(mongo à été ajouté a package.json)
```bash
npm run mongo
```

A ce stade nous pouvons Afficher, ajouter, supprimer, modifier des élément de la base de données mongo
nous avons 2 terminal ouvert:

* le terminal node.js
* le terminal docker mongo

Nous pouvons donc ouvrir une 3eme fenêtre de terminal pour executer nos requête curl


Pour afficher l'élément à l'index 0
```bash
curl localhost:8080/?index=0 -H 'secret: 7cTcjNyVJyudBqfE'
```
pour Ajouter un nouvel élément
```bash
curl -X POST -H "Content-Type: application/json" localhost:8080 -d '{"title":"Super titre3", "content": "super contenu3"}' -H 'secret: 7cTcjNyVJyudBqfE'
```
pour supprimer l'élément à l'index 4
```bash
curl -X DELETE localhost:8080/4 -H 'secret: 7cTcjNyVJyudBqfE'
```

pour  mettre à jour l'élément à l'index 0
```bash
curl -X PUT -H "Content-Type: application/json" localhost:8080/?index=0 -d '{"newTitle":"Mon nouveau titre", "newContent": "mon nouveau contenu"}' -H 'secret: 7cTcjNyVJyudBqfE'
```

Dans le terminal docker mongo ont peux afficher les éléments dans entré dans la base de donnée

* `use bdwa` pour se mettre sur la base de donnée
* `db.items.find()` pour afficher les éléments contenu dans la collections items