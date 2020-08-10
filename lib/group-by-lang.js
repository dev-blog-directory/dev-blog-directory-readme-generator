'use strict';

function groupByLang(blogs) {
  const group = {};
  if (!Array.isArray(blogs)) {
    return group;
  }

  blogs.forEach((blog) => {
    const langs = blog.langs || ['en'];
    langs.forEach((lang) => {
      group[lang] = group[lang] || [];
      group[lang].push(blog);
    });
  });
  return group;
}

module.exports = groupByLang;
