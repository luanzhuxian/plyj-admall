const MODEL = process.argv[process.argv.indexOf('--model') + 1]
const SERVER = process.argv[process.argv.indexOf('--s') + 1]
const NODE_ENV = process.env.NODE_ENV
const VERSION = process.env.npm_package_version

process.env.VUE_APP_VERSION = VERSION
process.env.VUE_APP_MODEL = MODEL

console.table([
    {
        NODE_ENV,
        MODEL,
        SERVER: `http://192.168.130.${ SERVER }`
    }
])
const externals = process.env.NODE_ENV === 'production'
    ? {
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
        moment: 'moment',
        axios: 'axios',
        swiper: 'swiper',
        'vue-awesome-swiper': 'VueAwesomeSwiper',
        'ali-oss': 'OSS',
        quill: 'Quill',
        viewerjs: 'Viewer',
        'v-viewer': 'VueViewer',
        compressorjs: 'Compressor',
        'element-ui': 'ELEMENT',
        echarts: 'echarts',
        'v-charts': 'VeIndex',
        qs: 'Qs'
    }
    : {}
module.exports = {
    pages: {
        index: {
            entry: 'src/main.ts',
            template: MODEL === 'local' ? 'public-dev/local.html' : MODEL === 'development' ? 'public-dev/index.html' : 'public/index.html',
            filename: 'index.html'
        }
    },

    publicPath: '/',
    outputDir: 'admall',
    assetsDir: MODEL === 'development' ? 'static' : `${ VERSION }/static`,

    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0',
        port: 7000,
        hot: true,
        open: true,
        overlay: {
            warnings: true,
            errors: true
        },
        // 如果设置为true，devServer会把编译后的文件存入磁盘，而不是存入内存，这样热刷新会慢一点，但是会节省内存
        writeToDisk: false,
        proxy: {
            // 测试37 前端服务器196 王恩74 李宾哲132 牛昌昌92 张涛149 刘兵227 任钊64 崔璐115 杜花171
            '/apis/v1': {
                target: `http://192.168.130.${ SERVER || 227 }`
                // target: 'https://admall.youpenglai.com'
            },
            '/apis/v2': {
                target: `http://192.168.130.${ SERVER || 227 }`
            }
        }
    },

    css: {
        sourceMap: process.env.NODE_ENV !== 'production',
        requireModuleExtension: true,
        loaderOptions: {
            sass: {
                prependData: '@import "~@/assets/scss/config.scss";',
                // 使用dart-sass编译
                implementation: require('sass')
            },
            css: {
                modules: {
                    localIdentName: '[local]-[hash:base64:10]'
                },
                localsConvention: 'camelCaseOnly'
            }
        }
    },
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: true,
    pluginOptions: {
        SourceMapDevToolPlugin: {
            noSources: false
        }
    },
    configureWebpack: {
        externals
    }
}
