const visit = require('unist-util-visit');

module.exports = ({ markdownAST, pathPrefix, reporter }, { basePath = ''}) => {
  // https://github.com/gatsbyjs/gatsby/issues/38362

  if (pathPrefix?.match('^(https?:\\/\\/)?')) {
    const url = pathPrefix.replace(/(http(s)*:)\/\//, `$1/`);
    visit(markdownAST, 'link', node => {
      if (node.url.includes(url)) {
        const newUrl = node.url.replace(url, basePath) || '/';
        reporter.info(`Fixing link href for "${node.url}" → "${newUrl}"`);
        node.url = newUrl;
        if (node.data?.hProperties?.target === '_blank') {
          delete node.data.hProperties.target;
          delete node.data.hProperties.rel;
        }
      }
    });
  }

  return markdownAST;
}