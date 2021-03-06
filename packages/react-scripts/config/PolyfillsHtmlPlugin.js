'use strict';

const changes = [
  {
    test: /\/main.+\.js/,
    replace: tag => {
      tag.attributes.defer = 'defer';
      return tag;
    },
  },
  {
    test: /\/polyfills.+\.js/,
    replace: tag => ({
      tagName: 'script',
      innerHTML: `window.fetch||document.write('<script src="${
        tag.attributes.src
      }"><\\/script>')`,
      closeTag: true,
    }),
  },
];

class PolyfillsHtmlPlugin {
  constructor(htmlWebpackPlugin) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
  }

  getInlinedTag(publicPath, assets, tag) {
    if (tag.tagName !== 'script' || !(tag.attributes && tag.attributes.src)) {
      return tag;
    }
    const scriptName = tag.attributes.src.replace(publicPath, '');

    for (let i = 0; i < changes.length; i++) {
      const change = changes[i];
      if (scriptName.match(change.test)) {
        return change.replace(tag);
      }
    }

    return tag;
  }

  apply(compiler) {
    let publicPath = compiler.options.output.publicPath;
    if (!publicPath.endsWith('/')) {
      publicPath += '/';
    }

    compiler.hooks.compilation.tap('PolyfillsHtmlPlugin', compilation => {
      const tagFunction = tag =>
        this.getInlinedTag(publicPath, compilation.assets, tag);

      const hooks = this.htmlWebpackPlugin.getHooks(compilation);
      hooks.alterAssetTagGroups.tap('PolyfillsHtmlPlugin', assets => {
        assets.headTags = assets.headTags.map(tagFunction);
        assets.bodyTags = assets.bodyTags.map(tagFunction);
      });

      // Still emit the runtime chunk for users who do not use our generated
      // index.html file.
      // hooks.afterEmit.tap('PolyfillsHtmlPlugin', () => {
      //   Object.keys(compilation.assets).forEach(assetName => {
      //     if (this.tests.some(test => assetName.match(test))) {
      //       delete compilation.assets[assetName];
      //     }
      //   });
      // });
    });
  }
}

module.exports = PolyfillsHtmlPlugin;
