
## Build

Run `node index.js` to build and host the project. The build will appear online at `http://localhost:8080/` and can be routed to a domain name with a server such as Nginx.

## Backend

Usiually Angular 2 routes requests to a PHP or Ruby backend using HTTP requests. This project forgoes the need of a seperate program and instead creates a small Express server. Spawning a client `ng build` process to render the application and using Socket.IO to communicate with Angular in the browser makes for a stellar team of serve and delivery.