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

const mapAlbumToModel = ({ id, name, year, cover }) => ({
  id,
  name,
  year,
  coverUrl: cover
    ? `http://${process.env.HOST}:${process.env.PORT}/upload/images/${cover}`
    : null,
});

module.exports = { mapSongToModel, mapSongDetailToModel, mapAlbumToModel };
