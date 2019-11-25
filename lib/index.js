#!/usr/bin/env node

'use strict';

const {resolve, dirname} = require('path');
const fs = require('fs-extra');
const readFiles = require('node-read-yaml-files');
const {slugify} = require('transliteration');
const {getNativeName} = require('iso-639-1');
const groupByLang = require('./group-by-lang.js');
const DEST_PATH = resolve(process.cwd(), './dist/readme.md');
const FEED_DB = resolve(process.cwd(), './feed-db.json');
const Feeds = require('./feeds.js');
let feeds;

function main(path) {
  return fs.remove(dirname(DEST_PATH))
    .then(() => fs.mkdirp(dirname(DEST_PATH)))
    .then(() => readFiles(path, {flatten: true}))
    .then(docs => docs.filter(doc => doc && typeof doc.url === 'string'))
    .then(docs => docs.sort(compare))
    .then(blogs => {
      feeds = new Feeds(FEED_DB);
      console.log('All blog count: ' + blogs.length);
      return blogs;
    })
    .then(groupByLang)
    .then(makeReadmeByLang)
    .then(makeJobs => Promise.all(makeJobs))
    .then(() => console.log('All Done!'))
    .catch(error => console.error('something exploded', error));
}

function compare(a, b) {
  let nameA = a.name; // ignore upper and lowercase
  let nameB = b.name; // ignore upper and lowercase

  nameA = sharpenName(nameA);
  nameB = sharpenName(nameB);

  if (nameA < nameB) {
    return -1;
  }

  if (nameA > nameB) {
    return 1;
  }

  // If name is equal, compare url and description
  return compareString(a.url, b.url) || compareString(a.desc, b.desc);
}

function compareString(a, b) {
  const nameA = (a || '').toLowerCase(); // ignore upper and lowercase
  const nameB = (b || '').toLowerCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }

  if (nameA > nameB) {
    return 1;
  }

  return 0;
}

function sharpenName(str) {
  str = unicode2Latin(str);

  // ignore upper and lowercase
  str = str.toLowerCase().trim();

  // Arrange non-alphabetic names after 'z'
  if (!/^[A-Za-z]/.test(str)) {
    return '\uFFFF' + str;
  }

  return str;
}

function unicode2Latin(str) {
  str = slugify(str);
  return str;
}

function makeReadmeByLang(group) {
  const allLangs = Object.keys(group).sort();
  return allLangs.map(lang => {
    const filePath = lang === 'en' ? DEST_PATH : DEST_PATH.replace('.md', `-${lang}.md`);
    return Promise.resolve(group[lang])
      .then(blogs => {
        console.log(`[${lang}] blog count: ${blogs.length}`);
        return blogs;
      })
      .then(blogs => makeReadme(blogs, lang, allLangs))
      .then(readme => fs.writeFileSync(filePath, readme))
      .then(() => console.log(`Done!\nGenerated ${filePath}`));
  });
}

function makeReadme(blogs, lang, allLangs) {
  const readme = [];
  let letter = 0;
  readme.push('# Developer Blog Directory');

  readme.push('');
  readme.push(`| ${allLangs.map(lang2 => {
    if (lang2 === lang) {
      return `**${getNativeName(lang2)}**`;
    }

    if (lang2 === 'en') {
      return `[${getNativeName(lang2)}](readme.md)`;
    }

    return `[${getNativeName(lang2)}](readme-${lang2}.md)`;
  }).join(' | ')} |`);
  readme.push('');
  readme.push('**Recommend your favorite developer blogs.**');
  readme.push('');
  readme.push('Generated from [dev-blog-directory-raw](https://github.com/dailyrandomphoto/dev-blog-directory-raw).');
  readme.push('');
  readme.push(getHeader());
  readme.push('');
  blogs.forEach(blog => {
    const startLetter = sharpenName(blog.name).charCodeAt(0);
    if (letter !== startLetter) {
      letter = startLetter;
      // If a-z
      if (letter <= 122) {
        readme.push(`\n## ${String.fromCharCode(startLetter - 32)} [[top](#developer-blog-directory)]\n`);
      } else {
        readme.push('\n## # [[top](#developer-blog-directory)]\n');
      }
    }

    readme.push(makeItem(blog));
  });
  readme.push('');
  readme.push('## Contribution');
  readme.push('Contributions are always welcome!');
  readme.push('[Contribution Guidelines](https://github.com/dailyrandomphoto/dev-blog-directory-raw#contribution-guidelines).');
  readme.push('');
  readme.push('## License');
  readme.push('Copyright (c) 2019 [dailyrandomphoto](https://github.com/dailyrandomphoto). Licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).');
  return readme.join('\n');
}

function getHeader() {
  const arr = [];
  // // arr.push('| D | E | V | . | B | L | O | G | . |\n');
  arr.push('| D | I | R | E | C | T | O | R | Y |\n');
  arr.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n');
  // Loop A-Z
  for (let i = 65; i <= 90; i++) {
    arr.push(`| [${String.fromCharCode(i)}](#${String.fromCharCode(i + 32)}-top) `);
    if ((i - 64) % 9 === 0) {
      arr.push('|\n');
    }
  }

  // Last one - #
  arr.push('| [#](#-top) |');
  return arr.join('');
}

function makeItem(blog) {
  const result = [];
  let rss = '';
  let rssUrl = blog.rss;
  if (!rssUrl) {
    rssUrl = (feeds.getFeed(blog.url) || {}).feedUrl;
  }

  if (rssUrl) {
    rss = ` ([Feed](${rssUrl}))`;
  }

  if (blog.desc) {
    result.push(`- [${blog.name}](${blog.url})${rss} - ${blog.desc}`);
  } else {
    result.push(`- [${blog.name}](${blog.url})${rss}`);
  }

  if (blog.categories || blog.tags) {
    const arr = [].concat(blog.categories || []).concat(blog.tags || []);
    const tags = arr.map(i => '`#' + i + '`').join(' ');
    result.push(`  <br>${tags}`);
  }

  return result.join('\n');
}

function exit(msg) {
  if (msg) {
    console.error('\n' + msg);
  }

  if (require.main === module) { // Called directly
    process.exit(1);
  } else { // Required as a module
    throw msg;
  }
}

if (require.main === module) { // Called directly
  const filename = process.argv.slice(2, 3)[0];
  if (!filename) {
    exit('Usage: readme-gen RAW_DATA_PATH\n  e.g.: $ npx readme-gen ../dev-blog-directory-raw/documents');
  }

  const filepath = resolve(process.cwd(), filename);

  console.log('file name: ' + filename);
  console.log('full path: ' + filepath);
  main(filepath);
} else { // Required as a module
  module.exports = main;
}
