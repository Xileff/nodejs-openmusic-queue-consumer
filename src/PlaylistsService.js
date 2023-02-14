const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const queryPlaylist = {
      text: `SELECT id, name FROM playlists WHERE id = $1`,
      values: [playlistId],
    };
    const resultPlaylist = await this._pool.query(queryPlaylist);
    const { id, name } = resultPlaylist.rows[0];

    const querySongs = {
      text: `SELECT s.id, s.title, s.performer
      FROM playlist_songs ps LEFT JOIN songs s
      ON s.id = ps.song_id
      WHERE ps.playlist_id = $1
      `,
      values: [playlistId],
    };
    const resultSongs = await this._pool.query(querySongs);
    const songs = resultSongs.rows;

    return {
      playlist: {
        id,
        name,
        songs,
      }
    }
  }
}

module.exports = PlaylistsService;