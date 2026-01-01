export const up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(80)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
    },
  });

  // Foreign key constraints
  pgm.addConstraint(
    'playlists',
    'fk_playlists.owner_id_owner.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

export const down = (pgm) => {
  pgm.dropTable('playlists');
};
