FROM node:alpine

# RUN add bash

WORKDIR /app

COPY build_frontend.sh ./
COPY client/ ./
RUN chmod +x ./build_frontend.sh
RUN ./build_frontend.sh
RUN sh ./build_frontend.sh

COPY server/package.json ./
COPY server/yarn.lock ./
COPY server/ ./
RUN yarn

ENV PORT 3005
ENV NODE_ENV production

EXPOSE 3005

CMD ["yarn", "start"]
