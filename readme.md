# sinnerschrader-website [![sinnerschrader.com status](https://img.shields.io/badge/status-live-green.svg?style=flat-square)](https://sinnerschrader.com/)

[![Made by SinnerSchrader](https://img.shields.io/badge/made%20by-SinnerSchrader-orange.svg?style=flat-square)](https://sinnerschrader.com/)
[![Travis](https://img.shields.io/travis/sinnerschrader/sinnerschrader-website.svg?style=flat-square)](https://travis-ci.org/sinnerschrader/sinnerschrader-website)
[![standard-readme compliant](https://img.shields.io/badge/readme-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> :earth_africa: Source project for https://www.sinnerschrader.com


![Screenshot of sinnschrader.com](./sinnerschradercom.jpg)


This repository contains

1. [The sources](./sources) required to build the markup for `sinnerschrader.com`
2. [Static assets](./static) used on the site
3. [The generated content](./docs) deployed to `sinnerschrader.com`
4. Sources for a Continiuous Integration setup on [TravisCI](https://travis-ci.org/sinnerschrader/sinnerschrader-website)

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.


```sh
$ git clone https://github.com/sinnerschrader/sinnerschrader-website.git
cd sinnerschrader-website
npm install
```

## Usage

This serves as project to maintain sinnerschrader.com.
To develop frontend sources you start the local development
setup like this:

```sh
$ npm run build:watch &
$ npm start
# Development server running on http://localhost:3000
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/sinnerschrader/sinnerschrader-website/issues/new) or submit a [Pull Request](https://github.com/sinnerschrader/sinnerschrader-website/pull/new/master). :heart:

`sinnerschrader-website` follows the [Contributor Covenant](http://contributor-covenant.org/version/1/3/0/) Code of Conduct.

You do not need to be a techie to help out – there is the superawesome Github Interface to edit files! Learn about this at the [Github Help](https://help.github.com/articles/editing-files-in-your-repository/).

## Related things

We build all kinds of awesome stuff at SinnerSchrader. Be sure to check out our [Github Org](https://github.com/sinnerschrader).

* [schlump](https://github.com/sinnerschrader/schlump) - A static site generator utilizing React.js
* [Free Radical Specification](https://github.com/sinnerschrader/free-radical-specification) – Specification for the team that built the initial release

## License
(c) SinnerSchrader
