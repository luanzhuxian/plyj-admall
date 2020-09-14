import { importFiles } from './../../../assets/ts/utils'

const context = require.context('./', false, /\/((?!index).)+\.ts$/)

export default importFiles(context)
