# ReadMe

This is the SinnerSchrader "s2 Website" Project.

## Starting the protype

### Get the most stable NodeJS-Server

    $ nave use stable

### Install all NodeJS modules and grunt-cli for build tools

    $ npm install
    $ npm install -g grunt-cli
    
This step is only required once.

### Run the Server

    $ npm start

open [http://localhost:3000]()

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

* Modernizr 2.x
* Less v2.x.x

### Used PostProcessors

* Autoprefixer for CSS (NodeJS and Grunt)
* ClosureCompiler and Uglify for JS/CSS (Grunt)
