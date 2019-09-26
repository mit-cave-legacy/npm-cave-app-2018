FROM node:10-alpine as client-deps
WORKDIR /client
COPY client/package.json .
COPY client/package-lock.json .
RUN npm i

FROM node:10-alpine as server-runtime-deps
COPY server/package.json .
COPY server/package-lock.json .
RUN npm i --only=production

FROM server-runtime-deps as server-build-deps
RUN npm i

FROM client-deps as client-build
WORKDIR /client
COPY client/src src
COPY client/.babelrc .
COPY client/jsconfig.json .
COPY client/package.json .
COPY client/package-lock.json .
COPY client/build.js .
RUN npm run build

FROM node:10-alpine as server-build
# server depends on some shared code in the client
# recreate the same directory structure so dependencies can be found
COPY client/src app/client/src
WORKDIR app/server
COPY --from=server-build-deps node_modules node_modules
COPY server/src src
COPY server/.babelrc .
COPY server/package.json .
RUN npm run build


FROM node:10-alpine
COPY server/run-model app/server/run-model
COPY server/public app/server/public
COPY --from=server-build app/server/dist app/server/dist
COPY --from=server-runtime-deps node_modules app/server/node_modules
COPY server/package.json app/server
COPY --from=client-build /client/dist app/server/public

ENV NODE_ENV="production"
EXPOSE 4000
CMD ["node", "app/server/dist/index.js"]
