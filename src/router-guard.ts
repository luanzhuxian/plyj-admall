import NProgress from 'nprogress'
export const beforeResolve = async (to, from, next) => {
    NProgress.start()
    next()
}

export const afterEach = () => {
    NProgress.done()
}
