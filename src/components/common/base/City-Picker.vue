<template>
    <div class="city-picker">
        <el-cascader
            v-if="loaded"
            ref="cascader"
            :options="options"
            style="width: 100%"
            :props="props"
            :clearable="clearable"
            :placeholder="placeholder"
            :value="defaultValue"
            @change="handleChange"
        />
    </div>
</template>

<script>
/* eslint-disable */
    import { getCityListByParentId } from '../../../apis/address'
    import { requestDB, closeDB, getStore, addData, update, getData } from '../../../assets/ts/indexedDB'

    let db

    /**
     * 根据父级id从数据库查找城市列表
     * @param parentCode {String} 父级id
     * @returns {Promise<any>}
     */
    function getListFromIndexed (parentCode) {
        return new Promise((resolve, reject) => {
            try {
                const DBIndex = getStore(db, 'cities', 'locationCode', 'parentCode', 'parentCode')
                    .index('parentCode')
                const DBRequest = DBIndex.getAll(String(parentCode))
                DBRequest.onsuccess = (event) => {
                    resolve(event.target.result || [])
                }
                DBRequest.onerror = (e) => {
                    reject(e)
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * 获取地址列表
     * @param parentCode {String} 父级id
     * @returns {Promise<any>}
     */
    function getListByParent (parentCode) {
        let list
        return new Promise(async resolve => {
            try {
                // 优先从数据库中查找，如果数据库找不到再从服务器查找，并将新的数据存入数据库
                if (db) {
                    try {
                        list = await getListFromIndexed(parentCode) // 部分浏览器可能会在获取store时报错
                    } catch (e) {
                        // 此处不适用throw
                        console.error(e)
                    }
                }
                // 如果数据库无数据，则从服务器获取，并将获取到的数据写入数据库
                if (list.length === 0) {
                    const { result } = await getCityListByParentId(parentCode)
                    list = result
                    let store = getStore(db, 'cities')
                    for (const item of list) {
                        // 是否为叶子节点，即最后一级
                        item.leaf = item.locationLevel === 4
                        try {
                            await addData(store, item)
                        } catch (e) {
                            break
                        }
                    }
                }
                resolve(list)
            } catch (e) {
                throw e
            }
        })
    }

    export default {
        name: 'CityPicker',
        data () {
            return {
                options: [],
                loaded: false,
                props: {
                    label: 'locationName',
                    value: 'locationCode',
                    expandTrigger: 'hover',
                    children: 'children',
                    lazy: true,
                    lazyLoad: async (node, resolve) => {
                        if (!node.data) {
                            resolve()
                            return
                        }
                        if (node.data.children && node.data.children.length) {
                            resolve()
                            return
                        }
                        // 请求下级地区
                        const children = await getListByParent(node.data.locationCode)
                        if (children && children.length > 0) {
                            resolve(children)
                        } else {
                            /*
                            * 没有子集的时候，设置leaf为true
                            * 并更新indexedDB中的数据
                            * 以便下次获取道数据时，直接就可以判断是不是leaf节点
                            * （标记为leaf节点的项，在点击的时候不会继续请求下一级，将触发选中事件）
                            * */
                            node.data.leaf = true
                            let store = getStore(db, 'cities')
                            update(store, node.data)
                            resolve()
                        }
                    }
                },
                db: null,
                citiesStore: null
            }
        },
        props: {
            clearable: {
                type: Boolean,
                default: true
            },
            defaultValue: {
                type: Array,
                default () {
                    return []
                }
            },
            placeholder: {
                type: String,
                default: '请选择地址'
            }
        },
        watch: {
            defaultValue (val) {
                this.init()
            }
        },
        async created () {
            try {
                // 如果数据结构发生变化，务必升级版本号（当前版本号3）
                db = await requestDB('CITY_DATA', 3)
            } catch (e) {
                db = null
                throw e
            }
            this.init()
        },
        methods: {
            async init () {
                this.loaded = false
                let options = []
                const CityList = await getListByParent(0)
                if (CityList) {
                    for (let item of CityList) {
                        item.children = []
                        options.push(item)
                    }
                }
                // 根据默认默认值， 获取各级数据
                const defaultIter = this.defaultValue[Symbol.iterator]()
                let code = defaultIter.next() // 第一个默认的locationCode
                let fatherList = options
                while (!code.done) {
                    // 找到父级项
                    const fatherItem = fatherList.find(item => item.locationCode === code.value)
                    if (fatherItem) {
                        // 根据上一步找到的父元素，查找它所有的孩子
                        const children = await getListByParent(code.value)
                        if (children && children.length) {
                            for (let item of children) {
                                if (!item.leaf) {
                                    item.children = []
                                }
                                fatherItem.children.push(item)
                            }
                            fatherList = children
                        } else {
                            fatherItem.leaf = true
                        }
                        code = defaultIter.next()
                    } else {
                        break
                    }
                }
                this.options = options
                this.loaded = true
            },
            async handleChange (val) {
                let items = await this.findItem(val)
                // if (items.length === 0) {
                //   return this.$emit('selected', null)
                // }
                const data = []
                for (const item of items) {
                    data.push({
                        name: item.locationName,
                        code: item.locationCode
                    })
                }
                this.$emit('selected', data)
            },
            // 根据已选id，找出每个id 对应的值
            async findItem (codes) {
                let items = []
                let store = getStore(db, 'cities')
                for (let code of codes) {
                    let item = await getData(store, code)
                    items.push(item)
                }
                return items
            }
        },
        destroyed () {
            closeDB(db)
        }
    }
</script>
