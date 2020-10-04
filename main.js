'use strict';

const ApplicationBuilder = require('./Framework/ApplicationBuilder');

(async () => {
  const applicationBuilder = new ApplicationBuilder();
  await applicationBuilder.buildServices();
  await applicationBuilder.build();
})();
