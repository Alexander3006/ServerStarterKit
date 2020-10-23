const Database = () => {
  const {
    pg: {Pool},
  } = npm;
  const {db} = configuration;
  return new Pool(db);
};

DatabaseProvider = () => {
  const db = Database();
  return db;
};
