# DEV-BLOG-DIRECTORY: readme-generator

[![NPM Version][npm-version-image]][npm-url]
[![LICENSE][license-image]][license-url]
[![Build Status][travis-image]][travis-url]
[![dependencies Status][dependencies-image]][dependencies-url]
[![devDependencies Status][devDependencies-image]][devDependencies-url]

A Generator to generate README of Developer Blog Directory.

## Installation

```sh
npm install dev-blog-directory-readme-generator
```

## Usages
```sh
$ npx readme-gen RAW_DATA_PATH
```
e.g.
```sh
$ npx readme-gen ../dev-blog-directory-raw/documents
```

## TOODs
- separate files by Languages.
- lastest published date
- RSS

## Related

- [dev-blog-directory](https://github.com/dev-blog-directory/dev-blog-directory) - A Developer Blog Directory.
- [dev-blog-directory-raw](https://github.com/dailyrandomphoto/dev-blog-directory-raw) - Raw data storage of [Developer Blog Directory](https://github.com/dev-blog-directory/dev-blog-directory).
- [dev-blog-directory-save](https://github.com/dailyrandomphoto/dev-blog-directory-save) - API for save new blogs to [dev-blog-directory-raw](https://github.com/dailyrandomphoto/dev-blog-directory-raw).
- [dev-blog-directory-save-json-cli](https://github.com/dailyrandomphoto/dev-blog-directory-save-json-cli) - A CLI for saves the JSON format blog list to `documents/*.yml`.
- [dev-blog-directory-save-yaml-cli](https://github.com/dailyrandomphoto/dev-blog-directory-save-yaml-cli) - A CLI for saves the YAML format blog list to `documents/*.yml`.

## License
Copyright (c) 2019 [dailyrandomphoto][my-url]. Licensed under the [MIT license][license-url].

[my-url]: https://github.com/dailyrandomphoto
[npm-url]: https://www.npmjs.com/package/dev-blog-directory-readme-generator
[travis-url]: https://travis-ci.org/dev-blog-directory/dev-blog-directory-readme-generator
[coveralls-url]: https://coveralls.io/github/dev-blog-directory/dev-blog-directory-readme-generator?branch=master
[license-url]: LICENSE
[dependencies-url]: https://david-dm.org/dev-blog-directory/dev-blog-directory-readme-generator
[devDependencies-url]: https://david-dm.org/dev-blog-directory/dev-blog-directory-readme-generator?type=dev

[npm-downloads-image]: https://img.shields.io/npm/dm/dev-blog-directory-readme-generator
[npm-version-image]: https://img.shields.io/npm/v/dev-blog-directory-readme-generator
[license-image]: https://img.shields.io/npm/l/dev-blog-directory-readme-generator
[travis-image]: https://img.shields.io/travis/dev-blog-directory/dev-blog-directory-readme-generator
[coveralls-image]: https://img.shields.io/coveralls/github/dev-blog-directory/dev-blog-directory-readme-generator
[dependencies-image]: https://img.shields.io/david/dev-blog-directory/dev-blog-directory-readme-generator
[devDependencies-image]: https://img.shields.io/david/dev/dev-blog-directory/dev-blog-directory-readme-generator
