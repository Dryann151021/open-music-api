export const up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('albums');
};
