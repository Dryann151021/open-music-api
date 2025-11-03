export const up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(80)',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    performer: {
      type: 'VArchar(50)',
      notNull: true,
    },
    genre: {
      type: 'varchar(50)',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
    },
    album_id: {
      type: 'VARCHAR(30)',
      references: '"albums"',
      onDelete: 'CASCADE',
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('songs');
};
