FROM node:12.8.0
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
# COPY package.json /app/package.json
ADD . /app/
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
RUN npm install -g serve
RUN npm run-script build

# start app
# CMD ["npm", "run", "build"]
