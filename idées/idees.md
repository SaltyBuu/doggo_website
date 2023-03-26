# Idées

- Pop-up machin vient de voter pour cette chanson
- Quand on cherche une musique qui existe déjà, ça scrolle à son niveau sinon, ça affiche un nouveau bouton
- Suppression d'une chanson si la seule personne qui a voté décide de l'enlever
- downvote ?
- highlight les plus gros sons sur la page d'accueil
- machin vient de monter dans la playlist4
- limite de vote par utilisateur pour restreindre les votes des gens, ou limiter votes mais pas ajouts
- boutons d'export
- fonctionnalité importante de pouvoir écouter en li
- toggle animation accueil
- vidéo de fond au lieu d'animation
- base de données musique pour la <recherche>
- réécriture d'url

## Front
- animation 60fps
- animation svg décomposée
- pour un responsive optimal faire pour mobile d'abord
- optimiser le chargement de la page
- div rond au chargement pas après avori chargé
- credits icones
- chargement puis mise en page
- changement taille albums responsive
- bouton gradient hover infini voir playlist

## Deployment
- githubaction vers le repo privé

### Questions
- On cherche une chanson dans le champ de texte, les suggestions
s'affichent dans la datalist, quand on clique dessus, le texte s'actualise
comment lier 

## Backend
### Questions
- playlist représentée par quoi ? sauvegardé dans un fichier serveur ?
- possible base de données ordonnée qu'on peut update à la volée ?
- comment faire la recherche ? api spotify ou base de données locale pour commencer
- une API renvoie un code d'erreur 200 si pas intercepté par des throw, pas de if else status ?

*Réponses*
- Playlist table postgresql avec un champ rang
- Chanson votée monte/descend en échangeant de place avec le rang d'avant

*Postgresql*

[playlists]: {*playlistId, name} \
[playlist_songs]: {*playlistId, *songId, votesNb, submitter} \
[songs]: {*songId, name, album, artist} \
[users]: {*userId, login, password, mail} \
[votes]: {*userId, *playlistId, *songId, voteDate}

### Fonctions de base
*Chansons*
- ajouter une chanson à la playlist
- supprimer une chanson de la playlist
- mettre à jour un nombre de votes

*Utilisateurs*
- rajouter un utilisateur
- supprimer un utilisateur
- chercher un utilisateur

*Recherche*
- rechercher dans la playlist
- rechercher dans l'ensemble des chansons existantes

*Action*
- Jouer une chanson de la playlist


## Avancé
- confirmation mail utilisateurs
- token utilisateur authentifié
- historiques
- cookie parser ?
- swagger
- réécriture d'url
- bd ssl
- chargement des pages intelligent
- historique des chansons cherchées
- try/catch sur les await prisma
- express validator
- Cache des requêtes

## Bugs
- url /base/doc plante le serveur -> gaffe aux url paramétrées