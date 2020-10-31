const testController = async (connection, context) => {
  const {
    services: { logger },
    session,
  } = context;
  logger.print('Test controller');
  logger.print(session);
  connection.sendJson(session);
};

({
  url: '/test',
  method: 'GET',
  handler: testController,
});
