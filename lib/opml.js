'use strict';

const opml = require('opml-generator');
const format = require('xml-formatter');
const {getNativeName} = require('iso-639-1');

function generate(blogs, lang) {
  const header = {
    title: 'Developer Blog Directory - ' + getNativeName(lang),
    dateCreated: new Date(2019, 10, 29).toUTCString(), // 2019/11/29
    dateModified: new Date().toUTCString(),
    ownerName: 'https://github.com/dailyrandomphoto'
  };

  const outlines = blogs.map(blog => ({
    type: 'rss',
    text: blog.name,
    title: blog.name,
    xmlUrl: blog.feed,
    htmlUrl: blog.url
  }));

  return format(opml(header, outlines), {collapseContent: true});
}

module.exports = {generate};
