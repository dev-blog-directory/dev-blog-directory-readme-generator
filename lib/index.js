#!/usr/bin/env node

'use strict';

const { resolve, dirname } = require('path');
const fs = require('fs-extra');
const readFiles = require('node-read-yaml-files');
const { slugify } = require('transliteration');
const { getNativeName } = require('iso-639-1');
const { Feeds } = require('feed-db');
const groupByLang = require('./group-by-lang.js');
const DEST_PATH = resolve(process.cwd(), './dist/readme.md');
const FEED_DB = resolve(process.cwd(), './feed-db.json');
const { generate } = require('./opml.js');

function main(path) {
  return fs
    .remove(dirname(DEST_PATH))
    .then(() => fs.mkdirp(dirname(DEST_PATH)))
    .then(() => readFiles(path, { flatten: true }))
    .then((docs) => docs.filter((doc) => doc && typeof doc.url === 'string'))
    .then((docs) => docs.sort(compare))
    .then((blogs) => {
      const feeds = new Feeds(FEED_DB);
      updateFeeds(blogs, feeds);
      console.log('All blogs count: ' + blogs.length);
      return blogs;
    })
    .then(groupByLang)
    .then((group) => makeReadmeByLang(group).concat(makeOpmlByLang(group)))
    .then((makeJobs) => Promise.all(makeJobs))
    .then(() => console.log('All Done!'))
    .catch((error) => console.error('something exploded', error));
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

function sharpenName(string) {
  string = unicode2Latin(string);

  // ignore upper and lowercase
  string = string.toLowerCase().trim();

  // Arrange non-alphabetic names after 'z'
  if (!/^[A-Za-z]/.test(string)) {
    return '\uFFFF' + string;
  }

  return string;
}

function unicode2Latin(string) {
  string = slugify(string);
  return string;
}

function makeReadmeByLang(group) {
  const allLangs = Object.keys(group).sort();
  return allLangs.map((lang) => {
    const filePath =
      lang === 'en' ? DEST_PATH : DEST_PATH.replace('.md', `-${lang}.md`);
    return Promise.resolve(group[lang])
      .then((blogs) => {
        console.log(`[${lang}] blogs in README count: ${blogs.length}`);
        return blogs;
      })
      .then((blogs) => makeReadme(blogs, lang, allLangs))
      .then((readme) => fs.writeFileSync(filePath, readme))
      .then(() => console.log(`Done!\nGenerated ${filePath}`));
  });
}

function makeReadme(blogs, lang, allLangs) {
  const readme = [];
  let letter = 0;
  readme.push('# Developer Blog Directory');

  readme.push('');
  readme.push('A comprehensive list of blogs of developers and teams.<br>');
  readme.push('**Recommend your favorite developer blogs.**');
  readme.push('');
  readme.push(
    '> Generated from [dev-blog-directory-raw](https://github.com/dev-blog-directory/dev-blog-directory-raw).'
  );
  readme.push('');
  readme.push(
    `| ${allLangs
      .map((lang2) => {
        if (lang2 === lang) {
          return `**${getNativeName(lang2)}**`;
        }

        if (lang2 === 'en') {
          return `[${getNativeName(lang2)}](readme.md)`;
        }

        return `[${getNativeName(lang2)}](readme-${lang2}.md)`;
      })
      .join(' | ')} |`
  );
  const opmlFilename = lang === 'en' ? 'readme.opml' : `readme-${lang}.opml`;
  readme.push('');
  readme.push(
    `Get [OPML](https://raw.githubusercontent.com/dev-blog-directory/dev-blog-directory/master/${opmlFilename})`
  );
  readme.push('');
  readme.push(getHeader());
  readme.push('');
  blogs.forEach((blog) => {
    const startLetter = sharpenName(blog.name).charCodeAt(0);
    if (letter !== startLetter) {
      letter = startLetter;
      // If a-z
      if (letter <= 122) {
        readme.push(
          `\n## ${String.fromCharCode(
            startLetter - 32
          )} [[top](#developer-blog-directory)]\n`
        );
      } else {
        readme.push('\n## # [[top](#developer-blog-directory)]\n');
      }
    }

    readme.push(makeItem(blog));
  });
  readme.push('');
  readme.push('## Contribution');
  readme.push('Contributions are always welcome!');
  readme.push(
    '[Contribution Guidelines](https://github.com/dev-blog-directory/dev-blog-directory-raw#contribution-guidelines).'
  );
  readme.push('');
  readme.push('## License');
  readme.push(
    'Copyright (c) 2020 [dailyrandomphoto](https://github.com/dailyrandomphoto). Licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).'
  );
  return readme.join('\n');
}

function getHeader() {
  const array = [];
  // // arr.push('| D | E | V | . | B | L | O | G | . |\n');
  array.push('| D | I | R | E | C | T | O | R | Y |\n');
  array.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n');
  // Loop A-Z
  for (let i = 65; i <= 90; i++) {
    array.push(
      `| [${String.fromCharCode(i)}](#${String.fromCharCode(i + 32)}-top) `
    );
    if ((i - 64) % 9 === 0) {
      array.push('|\n');
    }
  }

  // Last one - #
  array.push('| [#](#-top) |');
  return array.join('');
}

function makeItem(blog) {
  const result = [];
  const feed = blog.feed ? ` ([Feed](${blog.feed}))` : '';

  if (blog.desc) {
    result.push(`- [${blog.name}](${blog.url})${feed} - ${blog.desc}`);
  } else {
    result.push(`- [${blog.name}](${blog.url})${feed}`);
  }

  if (blog.categories || blog.tags) {
    const array = [].concat(blog.categories || []).concat(blog.tags || []);
    const tags = array.map((i) => '`#' + i + '`').join(' ');
    result.push(`  <br>${tags}`);
  }

  return result.join('\n');
}

function updateFeeds(blogs, feeds) {
  blogs.forEach((blog) => {
    const feedUrl = blog.feed;
    if (!feedUrl) {
      blog.feed = (feeds.getFeed(blog.url) || {}).feedUrl;
    }
  });
}

function makeOpmlByLang(group) {
  const allLangs = Object.keys(group).sort();
  return allLangs.map((lang) => {
    const filePath =
      lang === 'en'
        ? DEST_PATH.replace('.md', '.opml')
        : DEST_PATH.replace('.md', `-${lang}.opml`);
    return Promise.resolve(group[lang])
      .then((blogs) => blogs.filter((blog) => Boolean(blog.feed)))
      .then((blogs) => {
        console.log(`[${lang}] blogs in OPML count: ${blogs.length}`);
        return blogs;
      })
      .then((blogs) => generate(blogs, lang))
      .then((xml) => fs.writeFileSync(filePath, xml))
      .then(() => console.log(`Done!\nGenerated ${filePath}`));
  });
}

function exit(message) {
  if (message) {
    console.error('\n' + message);
  }

  if (require.main === module) {
    // Called directly
    process.exit(1);
  } else {
    // Required as a module
    throw message;
  }
}

if (require.main === module) {
  // Called directly
  const filename = process.argv.slice(2, 3)[0];
  if (!filename) {
    exit(
      'Usage: readme-gen RAW_DATA_PATH\n  e.g.: $ npx readme-gen ../dev-blog-directory-raw/documents'
    );
  }

  const filepath = resolve(process.cwd(), filename);

  console.log('file name: ' + filename);
  console.log('full path: ' + filepath);
  main(filepath);
} else {
  // Required as a module
  module.exports = main;
}
