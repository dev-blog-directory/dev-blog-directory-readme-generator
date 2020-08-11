# DEV-BLOG-DIRECTORY: readme-generator

[![NPM Version][npm-version-image]][npm-url]
[![LICENSE][license-image]][license-url]
[![Build Status][travis-image]][travis-url]
[![code style: prettier][code-style-prettier-image]][code-style-prettier-url]

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

- [x] separate files by Languages.
- [x] add feed links (RSS, OPML)
- [ ] lastest published date

## Related

- [dev-blog-directory](https://github.com/dev-blog-directory/dev-blog-directory) - A Developer Blog Directory.
- [dev-blog-directory-raw](https://github.com/dev-blog-directory/dev-blog-directory-raw) - Raw data storage of [Developer Blog Directory](https://github.com/dev-blog-directory/dev-blog-directory).
- [dev-blog-directory-save](https://github.com/dev-blog-directory/dev-blog-directory-save) - API for save new blogs to [dev-blog-directory-raw](https://github.com/dev-blog-directory/dev-blog-directory-raw).
- [dev-blog-directory-save-json-cli](https://github.com/dev-blog-directory/dev-blog-directory-save-json-cli) - A CLI for saves the JSON format blog list to `documents/*.yml`.
- [dev-blog-directory-save-yaml-cli](https://github.com/dev-blog-directory/dev-blog-directory-save-yaml-cli) - A CLI for saves the YAML format blog list to `documents/*.yml`.

## License

Copyright (c) 2020 [dailyrandomphoto][my-url]. Licensed under the [MIT license][license-url].

[my-url]: https://github.com/dailyrandomphoto
[npm-url]: https://www.npmjs.com/package/dev-blog-directory-readme-generator
[travis-url]: https://travis-ci.org/dev-blog-directory/dev-blog-directory-readme-generator
[license-url]: LICENSE
[code-style-prettier-url]: https://github.com/prettier/prettier
[npm-downloads-image]: https://img.shields.io/npm/dm/dev-blog-directory-readme-generator
[npm-version-image]: https://img.shields.io/npm/v/dev-blog-directory-readme-generator
[license-image]: https://img.shields.io/npm/l/dev-blog-directory-readme-generator
[travis-image]: https://img.shields.io/travis/dev-blog-directory/dev-blog-directory-readme-generator
[code-style-prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
