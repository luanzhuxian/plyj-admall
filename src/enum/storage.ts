/* 只放置有一定通用性的 storage key */
export enum SessionEnum {
    // 身份校验时间
    validateIdentityTime = 'VALIDATE_IDENTITY_TIME',
    // 微信注册时授权STATE
    redirectState = 'REDIRECT_STATE',
    // 微信登录时授权STATE
    loginState = 'LOGIN_STATE',
    // 微信授权CODE
    redirectCode = 'REDIRECT_CODE',
    // 发送验证码的时间
    verifyCodeTime = 'VERIFY_CODE_TIME',
    // 当前注册步骤
    currentStep = 'CURRENT_STEP',
    // 临时存储优惠券数据
    couponResultData = 'COUPON_RESULT_DATA',
    // 临时存储选中的优惠券
    selectedCouponList = 'SELECTED_COUPON_LIST'
}

export enum LocalEnum {
    token = 'TOKEN',
    refreshToken = 'REFRESH_TOKEN',
    mallId = 'MALL_ID',
    appId = 'APPID',
    agencyCode = 'AGENCY_CODE',
    // 账号管理-编辑
    editAccount = 'EDIT_ACCOUNT'
}

export enum RoleEnum {
    // 超级管理员
    superAdmin = 'SUPER_ADMIN',
    // 企业级管理
    enterpriseAdmin = 'ENTERPRISE_ADMIN',
    // 高级管理员
    admin = 'ADMIN',
    // 子账号
    employee = 'EMPLOYEE',
    // Helper
    helper = 'HELPER',
    // 普通会员
    menmbership = 'MEMBERSHIP',
    // 游客
    visitor = 'VISITOR'
}
