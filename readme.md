# ReadMe

This is the SinnerSchrader "s2 Website" Project.

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

open [http://localhost:3000]()

### Build process (watch tasks)

```shell
npm run build:watch
npm start
```

Afterwards open your editor and start hacking.

------------------------------------------------------------------

## Browsermatrix

The projects supports the S2 default Browsermatrix:

* Desktop
* - Chrome, Safari, Opera, Firefox, IE: current and previous
* Mobile
* - Android, iOS, IEMobile: current and previous
* - NO Blackberry and no Android stock browsers

## Used PreProcessors

* LessCSS for CSS

### Included Libs are

* Less v2.x.x

### Used PostProcessors

* Autoprefixer for CSS (NodeJS and Grunt)
* ClosureCompiler and Uglify for JS/CSS (Grunt)

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
