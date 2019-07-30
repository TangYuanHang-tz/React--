const { override, fixBabelImports,addLessLoader } = require('customize-cra');

// module.exports = function override(config, env) {
//     // do stuff with the webpack config...
//     return config;
//   };

//用来配置babel-plugin-import ，这是一个用于按需加载组件代码和样式的 babel 插件
 module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        // style: 'css',
        style: true,
    }),
    //利用了less-loader的 modifyVars 来进行主题配置
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' },
    }),
);

