# Idées

- Pop-up machin vient de voter pour cette chanson
  [OK] Quand on cherche une musique qui existe déjà, ça scrolle à son niveau sinon, ça affiche un nouveau bouton
- Suppression d'une chanson si la seule personne qui a voté décide de l'enlever
- downvote ?
- highlight les plus gros sons sur la page d'accueil
- machin vient de monter dans la playlist4
[TODO] limite de vote par utilisateur pour restreindre les votes des gens, ou limiter votes mais pas ajouts
- boutons d'export
  [OK] fonctionnalité importante de pouvoir écouter en live
  [OK] toggle animation accueil
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
- régler pb police
- texte remplacement image doit s'afficher correctement quand pas de cos
- responsive bouton se connecter
- neon titre playlist seulement sur hover paragraphe
- margins des chansons
- bug overflow police inscription

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
  [OK] token utilisateur authentifié
- historiques
- cookie parser ?
  [OK] swagger
- réécriture d'url
- bd ssl
- chargement des pages intelligent
- historique des chansons cherchées
- try/catch sur les await prisma
- express validator
- Cache des requêtes
- sécurité : utiliser rate-limiter-flexible pour limiter les tentatives d'authentification
- bundle du frontend js
- droit de l'api par vues
- console admin
- Logs pertinents
- icône de chargement avant d'arriver sur la page

## Performance
[OK] set NODE_ENV to production
- bd faire une view qui count * group by songid sur les votes
reste qu'à faire select where songid = n pour avoir le vote
au lieu de la requête patch

## Bugs
- url /base/doc plante le serveur -> gaffe aux url paramétrées
- options de l'api spotify ne s'affiche pas en tapant directement
- Entrée sur le formulaire de connexion renvoie vers localhost:3000 avec POST -> 404
- problème d'update du nombre de votes d'une chanson déjà submit
- Faire gestion des rôles, restreindre requetes utilisateurs à leurs votes