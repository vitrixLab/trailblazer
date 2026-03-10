// craco.config.js
const path = require('path');
const { whenProd } = require('@craco/craco');
const os = require('os');

console.log('CRACO config loaded');

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // 1. Enable Webpack 5 filesystem cache
      webpackConfig.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        version: '1.0',
      };

      // 2. Helper to check if a loader uses babel‑loader
      const usesBabelLoader = (useEntry) => {
        if (!useEntry) return false;
        if (Array.isArray(useEntry)) {
          return useEntry.some(item => 
            (item.loader && item.loader.includes('babel-loader')) ||
            (typeof item === 'string' && item.includes('babel-loader'))
          );
        }
        if (typeof useEntry === 'object' && useEntry.loader) {
          return useEntry.loader.includes('babel-loader');
        }
        if (typeof useEntry === 'string') {
          return useEntry.includes('babel-loader');
        }
        return false;
      };

      // 3. Locate the JS/TS rule that uses babel‑loader
      const rules = webpackConfig.module.rules.find((rule) => rule.oneOf)?.oneOf || [];
      let jsRule = null;
      for (const rule of rules) {
        if (rule.test && (rule.test.toString().includes('js') || rule.test.toString().includes('ts'))) {
          if (usesBabelLoader(rule.use)) {
            jsRule = rule;
            break;
          }
        }
      }

      // 4. If found, ensure `use` is an array and insert thread‑loader
      if (jsRule) {
        if (!Array.isArray(jsRule.use)) {
          jsRule.use = [jsRule.use];
        }

        try {
          require.resolve('thread-loader');
          jsRule.use.unshift({
            loader: require.resolve('thread-loader'),
            options: {
              workers: os.cpus().length - 1,
              workerParallelJobs: 50,
              poolTimeout: 2000,
            },
          });
          console.log('✅ thread-loader added to the build pipeline.');
        } catch (e) {
          console.warn(
            '⚠️ thread-loader is not installed. Run: pnpm add -D thread-loader'
          );
        }
      } else {
        console.warn(
          '⚠️ Could not find a rule using babel-loader. thread-loader not applied, but caching is still active.'
        );
      }

      return webpackConfig;
    },
  },
};