'use strict';

const ApplicationBuilder = require('./Framework/ApplicationBuilder');
const configuration = require('./config');
const dependencies = require(configuration.dependencies);

(async () => {
  const applicationBuilder = new ApplicationBuilder()
    .setConfigurations(configuration)
    .setDependencies(dependencies);
  await applicationBuilder.buildServices();
  await applicationBuilder.build();
})();
