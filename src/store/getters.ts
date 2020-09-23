export default {
    childRoute: (state: any) => state.childRoute,
    productType: (state: any) => state.productType,
    // 是否禁止支付
    forbiddenPay: (state: any) => state.theMallForbiddenPay.includes(state.user.mallId),
    defaultLogo: (state: any) => state.defaultLogo,
    // 左菜单栏组件名称
    navBarName: (state: any) => state.navBarName,
    roleMap: (state: any) => state.roleMap
}
