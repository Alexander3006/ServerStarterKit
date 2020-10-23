const testController = async (connection, services) => {
  const {logger} = services;
  logger.print('Test controller');
  logger.print(connection.session);
  connection.sendJson(connection.session);
};

({
  url: '/test',
  method: 'GET',
  handler: testController,
});
