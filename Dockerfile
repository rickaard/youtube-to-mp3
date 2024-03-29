FROM node:alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY ./ ./
RUN yarn

COPY build_frontend.sh ./
RUN chmod +x ./build_frontend.sh
RUN ./build_frontend.sh

ENV PORT 3010
ENV NODE_ENV production

EXPOSE 3010

CMD ["yarn", "start"]
