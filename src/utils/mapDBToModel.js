const mapSongToModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapSongDetailToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapPlaylistToModel = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = { mapSongToModel, mapSongDetailToModel, mapPlaylistToModel };
