function setup(sequelize) {
    const { playlist_songs, playlists, songs, users, votes } = sequelize.models
    playlists.hasMany(playlist_songs)
    playlist_songs.belongsTo(playlists)

    playlist_songs.hasOne(songs)
    songs.belongsToMany(playlist_songs)
    playlist_songs.hasOne(users)
    users.belongsToMany(playlist_songs)

    votes.hasOne(users)
    users.hasMany(votes)
    votes.hasOne(songs)
    songs.hasMany(users)
}
module.exports = { setup }
