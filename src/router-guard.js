import NProgress from 'nprogress'
export async function beforeResolve (to, from, next) {
  NProgress.start()
  next()
}

export function afterEach () {
  NProgress.done()
}
