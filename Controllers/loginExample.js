const loginController = async (connection, services) => {
    const {sessions} = services;
    const body = JSON.parse(await connection.receiveBody());
    await sessions.create(connection, body);
    connection.sendJson('Ok');
}

({
    method: 'POST',
    url: '/auth/login',
    handler: loginController,
})
