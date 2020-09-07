/* 导入需要的 element-ui 组件 */
/* eslint-disable */
import Vue from 'vue'
import ElementUI from 'admall-element'

import 'admall-element/packages/theme-chalk/src/index.scss'
// import '../../styles/element-variables.scss'
Vue.use(ElementUI)
const {
  Loading,
  MessageBox,
  Message
} = ElementUI
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
/**
 * 进一步封装 MessageBox
 * @param config {object | string} 配置 or 标题
 * config作为配置时的常用属性
 * @property config.title {string} MessageBox           标题
 * @property config.message {string | VNode} MessageBox 消息正文内容
 * @property config.dangerouslyUseHTMLString {Boolean}  是否将 message 属性作为 HTML 片段处理 (默认为false)
 * @property config.showClose {Boolean} MessageBox      是否显示右上角关闭按钮
 * @property config.confirmButtonText {string}          确定按钮的文本内容
 * @property config.confirmButtonClass {string}         确定按钮的自定义类名
 * @property config.closeOnClickModal {Boolean}         是否可通过点击遮罩关闭 MessageBox (默认为false)
 * @property config.closeOnPressEscape {Boolean}        是否可通过按下 ESC 键关闭 MessageBox (默认为false)
 * @property config.center {Boolean}                    是否居中布局 (默认为false)
 * @property config.roundButton {Boolean}               是否使用圆角按钮 (默认为false)
 * @return {Promise<void>}                              返回值
 */
Vue.prototype.$alert = async (config = {}) => {
  let configDefault = {
    title: '',
    message: '',
    confirmButtonText: '确定',
    closeOnClickModal: false
  }
  if (typeof config === 'string') {
    configDefault.title = config
  }
  if (typeof config === 'object') {
    Object.assign(configDefault, config)
  }
  try {
    await MessageBox(configDefault)
  } catch (e) {
    throw e
  }
}
/**
 * 进一步封装 MessageBox
 * @param config {object | string} 配置 or 标题
 * config作为配置时的常用属性
 * @property config.title {string} MessageBox            标题
 * @property config.message {string | VNode} MessageBox  消息正文内容
 * @property config.dangerouslyUseHTMLString {Boolean}   是否将 message 属性作为 HTML 片段处理 (默认为false)
 * @property config.showClose {Boolean} MessageBox       是否显示右上角关闭按钮
 * @property config.confirmButtonText {string}           确定按钮的文本内容
 * @property config.confirmButtonClass {string}          确定按钮的自定义类名
 * @property config.cancelButtonText {string}            取消按钮的文本内容
 * @property config.cancelButtonClass {string}           取消按钮的自定义类名
 * @property config.closeOnClickModal {Boolean}          是否可通过点击遮罩关闭 MessageBox (默认为false)
 * @property config.closeOnPressEscape {Boolean}         是否可通过按下 ESC 键关闭 MessageBox (默认为false)
 * @property config.center {Boolean}                     是否居中布局 (默认为false)
 * @property config.roundButton {Boolean}                是否使用圆角按钮 (默认为false)
 * @return {Promise<void>}                               返回值
 */
Vue.prototype.$confirm = async (config = {}) => {
  let configDefault = {
    title: '',
    message: '',
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    showCancelButton: true,
    showInput: false,
    closeOnClickModal: false
  }
  if (typeof config === 'string') {
    configDefault.title = config
  }
  if (typeof config === 'object') {
    Object.assign(configDefault, config)
  }
  try {
    await MessageBox(configDefault)
  } catch (e) {
    throw e
  }
}
/**
 * 进一步封装 MessageBox
 * @param config {object | string} 配置 or 标题
 * config作为配置时的常用属性
 * @property config.title {string} MessageBox            标题
 * @property config.message {string | VNode} MessageBox  消息正文内容
 * @property config.dangerouslyUseHTMLString {Boolean}   是否将 message 属性作为 HTML 片段处理 (默认为false)
 * @property config.showClose {Boolean} MessageBox       是否显示右上角关闭按钮
 * @property config.confirmButtonText {string}           确定按钮的文本内容
 * @property config.confirmButtonClass {string}          确定按钮的自定义类名
 * @property config.cancelButtonText {string}            取消按钮的文本内容
 * @property config.cancelButtonClass {string}           取消按钮的自定义类名
 * @property config.closeOnClickModal {Boolean}          是否可通过点击遮罩关闭 MessageBox (默认为false)
 * @property config.closeOnPressEscape {Boolean}         是否可通过按下 ESC 键关闭 MessageBox (默认为false)
 * @property config.center {Boolean}                     是否居中布局 (默认为false)
 * @property config.roundButton {Boolean}                是否使用圆角按钮 (默认为false)
 * @property config.inputPlaceholder {string}            输入框的占位符
 * @property config.inputType {string}                   输入框的类型 (默认为text)
 * @property config.inputValue {string}                  输入框的初始文本
 * @property config.inputPattern {Regexp}                输入框的校验表达式
 * @property config.inputValidator {Function}            输入框的校验函数。可以返回布尔值或字符串，若返回一个字符串, 则返回结果会被赋值给 inputErrorMessage
 * @property config.inputErrorMessage {string}           校验未通过时的提示文本 (默认为 输入的数据不合法!)
 * @return {Promise<text>}                               返回值
 */
Vue.prototype.$prompt = async (config = {}) => {
  let configDefault = {
    title: '',
    message: '',
    inputType: 'text',
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    showCancelButton: true,
    showInput: true,
    closeOnClickModal: false
  }
  if (typeof config === 'string') {
    configDefault.title = config
  }
  if (typeof config === 'object') {
    Object.assign(configDefault, config)
  }
  try {
    await MessageBox(configDefault)
  } catch (e) {
    throw e
  }
}

Vue.prototype.$notify = Notification
Vue.prototype.$success = (msg: string) => {
  const vm = Message.success({
    dangerouslyUseHTMLString: true,
    message: `<svg aria-hidden="true"><use xlink:href="#icon-chenggong"></use></svg><span>${msg}</span>`,
    duration: 3000
  })
}
Vue.prototype.$error = (msg: string) => {
  const vm = Message.error({
    dangerouslyUseHTMLString: true,
    message: `<svg aria-hidden="true"><use xlink:href="#icon-shibai"></use></svg><span>${msg}</span>`,
    duration: 3000
  })
}
Vue.prototype.$warning = (msg: string) => {
  const vm = Message.warning({
    dangerouslyUseHTMLString: true,
    message: `<svg aria-hidden="true"><use xlink:href="#icon-jinggao"></use></svg><span>${msg}</span>`,
    duration: 3000
  })
}
Vue.prototype.$info = Message.info
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
