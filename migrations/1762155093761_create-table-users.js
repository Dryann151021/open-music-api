export const up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'VARCHAR(80)',
      notNull: true,
    },
    fullname: {
      type: 'VARCHAR(80)',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('users');
};
