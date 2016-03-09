# ReadMe

This is the SinnerSchrader "s2 23" Project. It enables all S2 Frontend 
Developers to start quickly a new project hazzle-free with the basic stuff.
All basics are included, freqently used stuff is available via commented blocks.

The template engine runs on [Node.js](http://nodejs.org) which can be easily managed via [Nave](https://github.com/isaacs/nave) on OS X/Linux.

Used PreProcessors

* LessCSS for CSS
* Coffee-Script for JavaScript

Included Libs are

* jQuery 2.11.x
* Modernizr 2.x
* Less v2.x.x

Used PostProcessors

* Autoprefixer for CSS (NodeJS and Grunt)
* ClosureCompiler and Uglify for JS/CSS (Grunt)

If the given libs are outdated please update them in the s2 Git for new
project as well.

A base setup for Smaller is also included.

Contributions are very welcome. Web developement changes daily, so this project 
will never be final. If you want to add or update code, please create a new 
branch and [inform the team][mail-contact].

Important:
s2 should only provide stuff which is needed by new projects with at least 
90% probability. Project goal is to minimize the initial customization and setup time.

Happy Coding!


## Browsermatrix

The projects supports the S2 default Browsermatrix:

* Desktop
* - Chrome, Safari, Opera, FIrefox: current and previous
* - Firefox also last ESR
* - IE 9 (B-Support)
* Mobile
* - Android, iOS, IEMobile: current and previous
* - NON Blackberry and stock Android browsers

If you need to support other setups just update the Autoprefixer config.


## Starting a project

* Clone or update this project
* Copy it's files to your project folder (except the .git folder)
* Rename the namespace†

†Initial namespace (in JavaScript- and Less-files) is "s2". So after copying your project just make a Search-and-Replace over *all* project files - yes, it's save. The namespace should be the three letter client code (e.g. "s2z").

## NodeJS Server

### Get the most stable NodeJS-Server

    $ nave use stable

### Install all NodeJS modules and grunt-cli for build tools

    $ npm install
    $ npm install -g grunt-cli
    
This is step is only required once.

### Run the Server

    $ npm start

open [http://localhost:3000]()

That's it.

## Modernizr

### By default the project comes with two identical Modernizr copies

    $ js/ext/modernizr-2.7.1.js
    $ js/ext/modernizr-custom.js

Modernizr 2.7.1 is used by the GruntJS Task. The custom version is used in the project.
Don't make me think: leave everything as preconfigured. Just run `grunt Modernizr` to create the optimized version for your project. :)

## Run Smaller to generate production code of CSS and JS

    $ npm run-script build

## S2 Best Practices

[https://sos.sinnerschrader.de/x/VzYVAg]()
    

## S2 Recommended JavaScript Libraries per UseCase

[https://sos.sinnerschrader.de/x/IQYpAg]()

---

[s2-devs@sinnerschrader.com][mail-contact]


[mail-contact]: mailto:s2-devs@sinnerschrader.com
