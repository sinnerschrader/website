# sinnerschrader-website-static

[![Made by SinnerSchrader][3]][2]
[![npm package][1]][2]
[![Travis][4]][5]
[![standard-readme compliant][6]][7]

> :earth_africa: Proprietary static assets for https://www.sinnerschrader.com.

> Used by [sinnerschrader/sinnerschrader-website][0].


![Screenshot of sinnschrader.com](./sinnerschradercom.jpg)


This repository contains

1. Proprietary [static assets](./static) used on the sinnerschrader.com
2. Build scripts to test the assets against [sinnerschrader/sinnerschrader-website][0]
4. Build scripts to relase to npm

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.


```sh
$ npm install sinnerschrader-website-static
STATIC_PATH= "$(node -e 'console.log(require(\'sinnerschrader-website-static\')')"
cp -r STATIC_PATH static
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/sinnerschrader/sinnerschrader-website/issues/new) or submit a [Pull Request](https://github.com/sinnerschrader/sinnerschrader-website/pull/new/master). :heart:

`sinnerschrader-website` follows the [Contributor Covenant](http://contributor-covenant.org/version/1/3/0/) Code of Conduct.

You do not need to be a techie to help out – there is the superawesome Github Interface to edit files! Learn about this at the [Github Help](https://help.github.com/articles/editing-files-in-your-repository/).

---

(c) SinnerSchrader

[0]: https://github.com/sinnerschrader/sinnerschrader-website
[1]: https://img.shields.io/npm/v/sinnerschrader-website-static.svg?style=flat-square
[2]: https://www.npmjs.com/package/sinnerschrader-website-static
[3]: https://img.shields.io/badge/made%20by-SinnerSchrader-orange.svg?style=flat-square
[4]: https://img.shields.io/travis/sinnerschrader/sinnerschrader-website-static/master.svg?style=flat-square
[5]: https://travis-ci.org/sinnerschrader/sinnerschrader-website-static
[6]: https://img.shields.io/badge/readme-standard-brightgreen.svg?style=flat-square
[7]: https://github.com/RichardLitt/standard-readme
