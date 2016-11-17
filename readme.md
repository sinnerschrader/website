# ReadMe

This is the SinnerSchrader Website.

[![Build Status](https://travis-ci.org/sinnerschrader/sinnerschrader-website.svg?branch=master)](https://travis-ci.org/sinnerschrader/sinnerschrader-website)

## Starting the Prototype Server

### Get the most stable NodeJS-Server

```shell
nave use stable
```

### Install all NodeJS modules and grunt-cli for build tools

```shell
npm install
npm run build
```

This step is only required once.

### Run the Server

```shell
npm start
```

### Build process (watch tasks)

```shell
npm run build:watch
npm start
```

Afterwards open your editor and start hacking.

------------------------------------------------------------------

## Docker + Mesos deployment

Run docker container:

```shell
docker build --tag <docker-tag> .
docker run -it --rm -e "BASIC=/" -e "HTTPUSER=user;pass" -p 8080:80 <docker-tag>
```

Deploy docker container to mesos cluster:

```shell
docker push <docker-tag>
HTTPUSER="user;pass" envsubst < marathon.json |curl -X POST http://<marathon-host>:8080/v2/apps -d @- -H "Content-type: application/json"
```

## Use Maven as alternative

```shell
HTTPUSER="<username>;<password>" mvn package -P frontend,docker,marathon,twiri
```

## Image conversion and optimization scripts

* interlace

```shell
./scripts/interlace.sh

# Convert hero backgrounds to progressive jpgs
./scripts/interlace.sh  "static/images/backgrounds/**/*.jpg jpg"

# Convert static maps to interlaced png
./scripts/interlace.sh  "static/images/contents/sinnerschrader-*.png png"
```

------------------------------------------------------------------


## Browsermatrix

* Desktop: Chrome, Safari, Opera, Firefox, Edge: current and previous
* Mobile: Android, iOS: current and previous

