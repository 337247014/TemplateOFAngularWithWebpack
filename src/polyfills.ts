import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');

if (process.env.ENV === 'production') {
  // Production
} else {
  // Development and test
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}

//Angular应用要能在大多数的浏览器里运行，它还需要一些polyfills。
//Polyfills最好跟自己的应用代码和vendor代码区分开来单独打包

//由于这个包最先加载，所以polyfills.ts非常适合用来配置浏览器环境，如生产环境配置或是开发环境。