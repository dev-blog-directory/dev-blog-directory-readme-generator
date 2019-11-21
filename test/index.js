'use strict';

const {expect} = require('chai');
const main = require('dev-blog-directory-readme-generator');

describe('dev-blog-directory-readme-generator', () => {
  it('should do something', () => {
    expect(main).to.be.a('function');
  });
});

require('./group-by-lang.js'); // eslint-disable-line import/no-unassigned-import
