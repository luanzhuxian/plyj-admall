import { importFiles } from './../../../assets/ts/utils'

const context = require.context('./', false, /\/((?!index).)+\.ts$/)
export default [
    {
        path: '/orders-manage1',
        name: 'OrderManage1',
        children: [
            ...importFiles(context)
        ]
    }
]
