// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

/**
 * Front-end Variables
 * Mode: local development
**/
export const environment = {
  production: false,
  socket: 'http://localhost:3300',
  secure_socket: false
};
