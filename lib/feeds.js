'use strict';

const fs = require('fs');
const {readJsonSync: readFileSync} = require('node-serialization');

class Feeds {
  constructor(file) {
    if (fs.existsSync(file)) {
      this.init(file);
    } else {
      console.log(`Can't find file '${file}'.`);
      this.DB = {};
    }
  }

  init(file) {
    this.DB = readFileSync(file);
  }

  getFeed(url) {
    return this.DB[url];
  }
}

module.exports = Feeds;
