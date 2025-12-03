export const up = (pgm) => {
  pgm.createTable('album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    album_id: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'album_likes',
    'unique_album_like',
    'UNIQUE(album_id, user_id)'
  );

  // Foreign key constraints
  pgm.addConstraint(
    'album_likes',
    'fk_album_likes.album_id_album.id',
    'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'album_likes',
    'fk_album_likes.user_id_user.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  );
};

export const down = (pgm) => {
  pgm.dropTable('album_likes');
};
