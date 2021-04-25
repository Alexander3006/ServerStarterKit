const testController = async ({connection}, context) => {
  const {
    services: {logger},
    session,
  } = context;
  logger.info('Test controller');
  logger.info(session);
  connection.sendJson('ok');
};

new adapters.HttpEndpoint({
  url: '/test',
  method: 'GET',
  handler: testController,
});
