'use strict';

const {expect} = require('chai');
const groupByLang = require('../lib/group-by-lang.js');

describe('groupByLang', () => {
  it('should return empty object', () => {
    const result = groupByLang();
    expect(result).to.be.an('object');
    expect(Object.keys(result)).to.have.lengthOf(0);
    console.log(result);
  });

  it('default lang - en', () => {
    const blogs = [
      {url: 'http://blog.com/1'}
    ];
    const result = groupByLang(blogs);
    expect(result).to.be.an('object');
    expect(result.en).to.be.an('array').to.have.lengthOf(1);
    expect(result.en[0].url).to.be.eql('http://blog.com/1');
    console.log(result);
  });

  it('multi langs', () => {
    const blogs = [
      {url: 'http://blog.com/1'},
      {url: 'http://blog.com/2', langs: ['zh']},
      {url: 'http://blog.com/3', langs: ['ko']},
      {url: 'http://blog.com/4', langs: ['ja']},
      {url: 'http://blog.com/5', langs: ['en']},
      {url: 'http://blog.com/6', langs: ['zh']},
      {url: 'http://blog.com/7', langs: ['ko']},
      {url: 'http://blog.com/8', langs: ['ja']}
    ];
    const result = groupByLang(blogs);
    expect(result).to.be.an('object');
    expect(result.en).to.be.an('array').to.have.lengthOf(2);
    expect(result.zh).to.be.an('array').to.have.lengthOf(2);
    expect(result.en[0].url).to.be.eql('http://blog.com/1');
    expect(result.zh[0].url).to.be.eql('http://blog.com/2');
    expect(result.ko[0].url).to.be.eql('http://blog.com/3');
    expect(result.ja[0].url).to.be.eql('http://blog.com/4');
    console.log(result);
  });

  it('multi langs 2', () => {
    const blogs = [
      {url: 'http://blog.com/1'},
      {url: 'http://blog.com/2', langs: ['zh', 'en']},
      {url: 'http://blog.com/3', langs: ['ko', 'en']},
      {url: 'http://blog.com/4', langs: ['ja', 'en']},
      {url: 'http://blog.com/5', langs: ['en', 'ko']},
      {url: 'http://blog.com/6', langs: ['zh', 'ko']},
      {url: 'http://blog.com/7', langs: ['ko']},
      {url: 'http://blog.com/8', langs: ['ja']}
    ];
    const result = groupByLang(blogs);
    expect(result).to.be.an('object');
    expect(result.en).to.be.an('array').to.have.lengthOf(5);
    expect(result.zh).to.be.an('array').to.have.lengthOf(2);
    expect(result.ko).to.be.an('array').to.have.lengthOf(4);
    expect(result.en[0].url).to.be.eql('http://blog.com/1');
    expect(result.zh[0].url).to.be.eql('http://blog.com/2');
    expect(result.ko[0].url).to.be.eql('http://blog.com/3');
    expect(result.ja[0].url).to.be.eql('http://blog.com/4');
    console.log(result);
  });
});
