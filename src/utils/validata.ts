export function checkTel(data: string): boolean {
    //验证手机号正则
    const reg = /^1[3456789]\d{9}$/;
    return !reg.test(data) ? true : false;
}

export function checkPasswordLength(data: string): boolean {
    //密码6位以上，数字字母
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
    return !reg.test(data) ? true : false;
}
