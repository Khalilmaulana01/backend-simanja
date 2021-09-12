require('dotenv').config();
const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('simanja_jwt, jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      // TODO: put into .dotenv
      maxAgeSec: process.env.ACCESS_TOKEN_AGE, // 4 hours
    },
    validate: (artifacts) => ({
      isValid: true,
      credential: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.start();
  console.log(`Server running in ${server.info.uri}`);
  process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
  });
};

init();
