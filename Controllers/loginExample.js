const loginController = async ({connection}, context) => {
  const {
    services: {sessions},
  } = context;
  const body = JSON.parse(await connection.receiveBody());
  await sessions.create(connection, body);
  connection.sendJson('Ok');
};

new adapters.HttpEndpoint({
  method: 'POST',
  url: '/auth/login',
  handler: loginController,
});
