/**
 * 请求连接/创建数据库
 * @param databaseName {String} 数据库名称
 * @param version {Number} 数据库版本
 * @returns {Promise<any>}
 */
export const requestDB = function (databaseName: string, version = 1) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(databaseName, version)
        request.onsuccess = (event: any) => {
            resolve(event.target.result)
            console.warn('indexedDB is connection')
        }
        request.onerror = e => {
            reject(e)
        }
        request.onupgradeneeded = (event: any) => {
            resolve(event.target.result)
            console.warn('indexedDB is upgraded')
        }
    })
}

/**
 * 创建表并返回表对象仓库（相当于SQL的表）
 * @param db {IDBDatabase} 数据库连接对象
 * @param tableName {String} 对象仓库名称（表名）
 * @param keyPath {String|Number} 主键
 * @returns {IDBObjectStore}
 */
export const createStore = function (db: IDBDatabase, tableName: string, keyPath: string) {
    return db.createObjectStore(tableName, { keyPath })
}

/**
 * 通过表事物对象返回对象仓库，和createStore返回对象一致
 * 此方法用于获取已经存在的对象仓库
 * IndexDB的所有操作全部基于事务，所以是通过事务来获取对象仓库
 * @param db {IDBDatabase} 数据库连接对象
 * @param tableName {String} 对象仓库名称（表名）
 * @returns {IDBObjectStore}
 */
export const getDBObjectStore = function (db: IDBDatabase, tableName: string) {
    return db.transaction([tableName], 'readwrite').objectStore(tableName)
}

/**
 * 获取表对象, 返回IDBObjectStore对象
 * @param db {IDBDatabase} 数据库对象
 * @param storeName 表名称
 * @param keyPath 主键
 * @param name 索引名称
 * @param index 索引所在的属性
 * @returns {IDBObjectStore}
 */
export const getStore = function (db: IDBDatabase, storeName: string, keyPath: string, name: string, index: string) {
    try {
        let citiesStore = null
        if (!db.objectStoreNames.contains(storeName)) {
            // 对象仓库不存在时，创建对象仓库
            citiesStore = createStore(db, storeName, keyPath)
            // 创建索引，索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
            citiesStore.createIndex(name, index, { unique: false })
        } else {
            citiesStore = getDBObjectStore(db, storeName)
        }
        return citiesStore
    } catch (e) {
        throw e
    }
    // try {
    //   let citiesStore = null
    //   if (!db.objectStoreNames.contains('cities')) {
    //     // 对象仓库不存在时，创建对象仓库
    //     citiesStore = createStore(db, 'cities', 'locationCode')
    //     // 创建索引，索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
    //     citiesStore.createIndex('parentCode', 'parentCode', { unique: false })
    //   } else {
    //     citiesStore = getDBObjectStore(db, 'cities')
    //   }
    //   return citiesStore
    // } catch (e) {
    //   throw e
    // }
}

/**
 * 关闭数据库连接
 * @param db {IDBDatabase}
 */
export const closeDB = function (db: IDBDatabase) {
    db.close()
    console.warn('indexedDB is closed')
}

/**
 * 插入数据
 * @param store {IDBObjectStore}
 * @param data {Object}
 * */
export const addData = function (store: IDBObjectStore, data: object) {
    return new Promise((resolve, reject) => {
        try {
            const request = store.add(data)
            request.onsuccess = () => {
                resolve()
            }
            request.onerror = (e: any) => {
                reject(new Error(e.target.error))
            }
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 修改数据
 * @param store {IDBObjectStore}
 * @param data {Object}
 * */
export const update = function (store: IDBObjectStore, data: object) {
    return new Promise((resolve, reject) => {
        try {
            const request = store.put(data)
            request.onsuccess = () => {
                resolve()
            }
            request.onerror = (e: any) => {
                reject(new Error(e.target.error))
            }
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 查询单个数据
 * @param store {IDBObjectStore}
 * @param key {string|number} 主键值
 */
export const getData = function (store: IDBObjectStore, key: string) {
    return new Promise((resolve, reject) => {
        const DBRequest = store.get(key)
        DBRequest.onsuccess = (event: any) => {
            resolve(event.target.result)
        }
        DBRequest.onerror = (event: any) => {
            reject(event.target.error)
        }
    })
}
