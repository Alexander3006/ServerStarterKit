const Database = () => {
  const {
    pg: {Pool},
  } = node_modules;
  const {db} = configuration;
  return new Pool(db);
};

({
  imports: [],
  factory: () => {
    const db = Database();
    return db;
  },
});
