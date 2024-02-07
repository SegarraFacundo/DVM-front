FROM amd64/debian:11

WORKDIR /usr/src/app

RUN apt-get remove ca-certificates

RUN apt-get update && \
    apt-get install -yq --no-install-recommends \
    curl \ 
    wget \
    git \
    gnupg \
    gcc \
    g++ \
    make \
    ca-certificates

RUN  curl -sL https://deb.nodesource.com/setup_20.x | bash -

RUN apt policy nodejs

RUN apt install -y nodejs 
RUN node -v

RUN npm -v

COPY . .

RUN npm install

EXPOSE 5173