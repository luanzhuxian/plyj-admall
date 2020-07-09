/**
 * 设置sentry版本，并商品sourceMap文件
 * @module
 * @type {module:child_process}
 */
const fs = require('fs')
const cp = require('child_process')
const VERSION = require('./package.json').version
const MODEL = process.argv[process.argv.indexOf('--model') + 1]
const assetsDir = `${VERSION}/static/js`
// 资源跟目录
const dir = 'admall'
// 项目名称
const project = 'admall'
// 组织
const ORG = 'penglai'
console.log('version: ', VERSION)
console.log('model: ', MODEL)
console.log('assetsDir: ', assetsDir)

console.log(`创建版本：${VERSION}`)
console.log(`sentry-cli releases -o ${ORG} -p ${project} new ${VERSION}`)
console.log(cp.execSync(`sentry-cli releases -o ${ORG} -p ${project} new ${VERSION}`, { encoding: 'utf8' }))

console.log(`清除 ${VERSION} 版本SourceMap 文件`)
console.log(`sentry-cli releases -o ${ORG} -p ${project} files ${VERSION} delete --all`)
console.log(cp.execSync(`sentry-cli releases -o ${ORG} -p ${project} files ${VERSION} delete --all`, { encoding: 'utf8' }))

console.log(`上传sourceMap文件`)
console.log(`sentry-cli releases -o ${ORG} -p ${project} files ${VERSION} upload-sourcemaps ./${dir}/${assetsDir} --url-prefix ~/${assetsDir}`)
console.log(cp.execSync(`sentry-cli releases -o ${ORG} -p ${project} files ${VERSION} upload-sourcemaps ./${dir}/${assetsDir} --url-prefix ~/${assetsDir}`, { encoding: 'utf8' }))

console.log(`发布版本：${VERSION}`)
console.log(`sentry-cli releases -o ${ORG} -p ${project} finalize ${VERSION}`)
console.log(cp.execSync(`sentry-cli releases -o ${ORG} -p ${project} finalize ${VERSION}`, { encoding: 'utf8' }))

console.log(`删除本地sourceMap文件`)
const files = fs.readdirSync(`./${dir}/${assetsDir}`)
for (const f of files) {
  if (f.indexOf('js.map') > -1) {
    fs.unlinkSync(`./${dir}/${assetsDir}/${f}`)
    console.warn(`文件 ${f} 已删除成功`)
  }
}
