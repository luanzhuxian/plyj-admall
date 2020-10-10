export enum sessionEnum {
    // 身份校验时间
    validateIdentityTime = 'VALIDATE_IDENTITY_TIME',
    // 微信授权STATE
    redirectState = 'REDIRECT_STATE',
    // 微信授权CODE
    redirectCode = 'REDIRECT_CODE',
    // 发送验证码的时间
    verifyCodeTime = 'VERIFY_CODE_TIME',
    // 当前注册步骤
    currentStep = 'CURRENT_STEP',
}
