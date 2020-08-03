<template>
    <el-container class="login">
        <!-- 顶部组件 -->
        <el-header>
            <HeaderWarp
                name="大语文学习平台"
                text="没有账号，请"
                maybe="注册"
                route="register"
            />
        </el-header>
        <el-main>
            <div class="login_form">
                <div class="left"></div>
                <div class="right">
                    <p>登录</p>

                    <!-- 输入框 -->
                    <el-form
                        :model="ruleForm"
                        status-icon
                        :rules="rules"
                        ref="loginForm"
                        class="login-form"
                        size="medium"
                    >
                        <el-form-item prop="username" class="item-from">
                            <label for="username">请输入手机号</label>
                            <el-input
                                id="username"
                                type="text"
                                v-model="ruleForm.username"
                                autocomplete="off"
                            ></el-input>
                        </el-form-item>

                        <div
                            class="forget"
                            @click="goResetPassword"
                            v-if="model == 'telphone'"
                        >
                            忘记密码？
                        </div>
                        <el-form-item
                            prop="password"
                            class="item-from"
                            v-if="model == 'telphone'"
                        >
                            <label for="password">请输入密码</label>
                            <el-input
                                id="password"
                                type="password"
                                v-model="ruleForm.password"
                                autocomplete="off"
                                minlength="6"
                                maxlength="20"
                            ></el-input>
                        </el-form-item>

                        <el-form-item prop="code" class="item-from" v-else>
                            <label>输入验证码</label>
                            <el-row :gutter="15">
                                <el-col :span="15">
                                    <el-input
                                        v-model="ruleForm.code"
                                        minlength="6"
                                        maxlength="6"
                                        autocomplete="off"
                                    ></el-input>
                                </el-col>
                                <el-col :span="9">
                                    <el-button
                                        style="width:100%"
                                        type="primary"
                                        class="block"
                                        @click="getSms"
                                        :disabled="codeButtonStatus.status"
                                        >{{ codeButtonStatus.text }}</el-button
                                    >
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <div class="enroll">
                            <span class="span_a" v-if="model == 'telphone'"
                                >手机号可以使用</span
                            >
                            <span @click="substituteModel(model)">{{
                                model == "telphone" ? "短信验证码" : "密码登录"
                            }}</span>
                        </div>
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="submitForm('loginForm')"
                                class="submit"
                                >立即登录</el-button
                            >
                            <p class="warn" v-if="model == 'code'">
                                新用户验证手机后自动登录
                            </p>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-main>
    </el-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderWarp from "@/components/login-header/header.vue";
import { checkTel } from "@/utils/validata";
import {
    getSms,
    codeLogin,
    passwordLogin,
    userStatus,
} from "@/api/login/login";
import { Form as ElForm, Input } from "element-ui";
import { UserModule } from "@/store/module/userInfo";

@Component({
    name: "login",
    components: {
        HeaderWarp,
    },
})
export default class login extends Vue {
    /**
     * vue2.6 javascript 写法
     * @data
     * @return
     */
    // 验证手机号
    private validateUsername = (
        rule: any,
        value: string,
        callback: Function
    ): void => {
        if (value === "") callback(new Error("请输入手机号"));
        else if (checkTel(value)) callback(new Error("手机号格式有误"));
        else callback(); //true
    };
    // 验证密码
    private validatePassword = (
        rule: any,
        value: string,
        callback: Function
    ): void => {
        if (value === "") callback(new Error("请输入密码"));
        else if (value.length < 6) callback(new Error("密码不少于6位"));
        else callback();
    };

    // 验证验证码
    private validateCode = (
        rule: any,
        value: string,
        callback: Function
    ): void => {
        if (value === "") return callback(new Error("请输入验证码"));
        else callback();
    };

    private model: string = "telphone";
    private timer: any = null;
    private codeButtonStatus: { [key: string]: boolean | string } = {
        status: false,
        text: "获取验证码",
    };
    private ruleForm: { [key: string]: string } = {
        username: "",
        password: "",
        code: "",
    };
    private rules: {
        [key: string]: Array<{ [key: string]: string | Function }>;
    } = {
        username: [{ validator: this.validateUsername, trigger: "blur" }],
        password: [{ validator: this.validatePassword, trigger: "blur" }],
        code: [{ validator: this.validateCode, trigger: "blur" }],
    };

    /**
     * vue2.6 javascript
     * @methods
     */

    private goRegister(): void {
        this.$router.push({
            name: "register",
        });
    }

    //跳转重置密码
    private goResetPassword(): void {
        this.$router.push({
            name: "changePassword",
        });
    }
    // 切换验证码和密码登录按钮
    private substituteModel(model: string): void {
        // 切换重置表单
        (this.$refs["loginForm"] as ElForm).resetFields();
        if (model == "telphone") {
            this.model = "code";
        } else {
            this.model = "telphone";
            clearInterval(this.timer);
            this.codeButtonStatus.status = false;
            this.codeButtonStatus.text = "获取验证码";
        }
    }

    // 获取验证码
    private getSms(): any {
        if (this.ruleForm.username == "") {
            this.$message.error("手机号不能为空！！");
            return false;
        }
        if (checkTel(this.ruleForm.username)) {
            this.$message.error("手机号有误，请重新输入！！");
            return false;
        }

        // 定时器
        var s = 60;
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval((): void => {
            s--;
            if (s == 0) {
                clearInterval(this.timer);
                this.codeButtonStatus.status = false;
                this.codeButtonStatus.text = "再次获取";
            } else {
                this.codeButtonStatus.status = true;
                this.codeButtonStatus.text = `倒计时${s}秒`;
            }
        }, 1000);

        //调取接口
        this.getCode(this.ruleForm.username);
    }

    // 提交按钮
    private submitForm(formName: string): any {
        (this.$refs[formName] as ElForm).validate((valid: boolean):
            | boolean
            | void => {
            if (valid) {
                this.model == "telphone" ? this.tel_Login() : this.code_Login();
            } else {
                return false;
            }
        });
    }

    // 获取验证码
    private getCode(tel: string): void {
        getSms({
            mobile: tel,
        });
    }

    // 密码登陆
    private tel_Login(): void {
        passwordLogin({
            mobile: this.ruleForm.username,
            role: 1,
            password: this.ruleForm.password,
        }).then((res: any): void => {
            if (res.data.data.status == 2) {
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "warning",
                });
                setTimeout(() => {
                    this.$router.push({
                        name: "register",
                    });
                }, 2000);
            } else if (res.data.data.status == 3) {
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "error",
                });
            } else if (res.data.data.status == 1) {
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "success",
                });
                var TOKEN = res.data.data.user.authorization;
                var TEL = res.data.data.user.mobile;
                UserModule.getAuthorization(TOKEN);
                UserModule.getTelephone(TEL);

                userStatus().then((res: any) => {
                    localStorage.setItem("is_buy", res.data.data.is_buy);
                    if (res.data.data.is_buy) {
                        setTimeout(() => {
                            this.$router.push({
                                path: "/student",
                            });
                        }, 2000);
                    } else {
                        setTimeout(() => {
                            this.$router.push({
                                path: "/",
                            });
                        }, 2000);
                    }
                });
            }
        });
    }

    //验证码登陆
    private code_Login(): void {
        codeLogin({
            mobile: this.ruleForm.username,
            role: 1,
            code: this.ruleForm.code,
        }).then((res: any): void => {
            if (res.data.data.status == 4) {
                //验证码错误
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "error",
                });
                this.ruleForm.code = "";
            } else if (res.data.data.status == 1) {
                //新用户登录相当于注册（成功）
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "success",
                });

                var TOKEN = res.data.data.user.authorization;
                var TEL = res.data.data.user.mobile;
                UserModule.getAuthorization(TOKEN);
                UserModule.getTelephone(TEL);
                userStatus().then((res: any) => {
                    localStorage.setItem("is_buy", res.data.data.is_buy);
                    if (res.data.data.is_buy) {
                        setTimeout(() => {
                            this.$router.push({
                                path: "/student",
                            });
                        }, 2000);
                    } else {
                        setTimeout(() => {
                            this.$router.push({
                                path: "/",
                            });
                        }, 2000);
                    }
                });
            } else if (res.data.data.status == 10) {
                //服务器错误
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "error",
                });
            }
        });
    }
}
</script>
<style lang="scss" scoped>
.login {
    min-width: 1200px;
    width: 100%;
    height: 100vh;
    .el-header {
        padding: 0;
        z-index: 2;
    }
    .el-main {
        background: #f4f4f4;
        padding-top: 120px;
        box-sizing: border-box;
        .login_form {
            width: 814px;
            height: 450px;
            box-shadow: 1px 1px 10px 0px rgba(54, 54, 54, 0.36);
            border-radius: 20px;
            margin: auto;
            background: #fff;
            display: flex;
            .left {
                height: 100%;
                width: 310px;
                background-image: url("../../assets/images/denglu_bg.png");
                background-size: 100%, 100%;
            }
            .right {
                width: calc(100% - 310px);
                padding: 29px 50px;
                box-sizing: border-box;
                position: relative;
                p {
                    font-size: 30px;
                    font-family: Source Han Sans CN;
                    font-weight: 500;
                    color: rgba(51, 51, 51, 1);
                    text-align: center;
                    margin-bottom: 50px;
                }
                .submit {
                    width: 100%;
                    margin-top: 50px;
                }
                .warn {
                    font-size: 12px;
                    color: #999;
                    margin: 0;
                }
                .forget {
                    color: #63a7f8;
                    font-size: 14px;
                    position: absolute;
                    z-index: 2;
                    top: 52%;
                    right: 9%;
                    cursor: pointer;
                }
                .enroll {
                    font-size: 14px;
                    text-align: right;
                    z-index: 2;
                    width: 100%;
                    height: 26px !important;
                    position: absolute;
                    right: 10%;
                    top: 68%;
                    color: #666666;

                    span {
                        color: #63a7f8;
                        cursor: pointer;
                    }
                    .span_a {
                        color: #333333;
                        cursor: default;
                        margin-right: 5px;
                    }
                }
            }
        }
    }
}
</style>
