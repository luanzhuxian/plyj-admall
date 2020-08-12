import {
    registerMicroApps,
    addGlobalUncaughtErrorHandler,
    start
} from 'qiankun'
import apps from './apps'

/**
 * 注册微应用
 * @param apps {Array} 微应用配置列表
 * @param lifeCycles {object} qiankun的声明周期对象
 */
registerMicroApps(apps, {
    // 微应用加载钱
    beforeLoad: app => {
        console.warn(`${ app.name } before load`)
        return Promise.resolve()
    },
    // 微应用挂载后
    afterMount: app => {
        console.warn(`${ app.name } before mounted`)
        return Promise.resolve()
    }
})

/**
 * 添加全局的未捕获异常处理器
 */
addGlobalUncaughtErrorHandler(err => {
    console.error(err)
    // const { message } = err
    // // 加载失败时提示
    // if (message && message.includes('died in status LOADING_SOURCE_CODE')) {
    //     console.error('微应用加载失败，请检查应用是否可运行')
    // }
})

export default start
