const testController = async (connection, services) => {
  const {logger} = services;
  logger.print('Test controller');
  connection.sendJson('Hello from testController');
};

({
  url: '/test',
  method: 'GET',
  handler: testController,
});
