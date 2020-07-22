<template>
    <el-container class="login-header">
        <div
            class="header"
            :name="name"
            :route="route"
            :text="text"
            :maybe="maybe"
            :show="show"
        >
            <div class="logo">
                <img src="@/assets/images/logo.png" alt="logo" />
                <h1>{{ name }}</h1>
            </div>
            <div class="warp_control" v-if="show">
                <p>
                    <span>{{ text }}</span>
                    <span @click="handle_where(route)">{{ maybe }}</span>
                </p>
            </div>
            <div class="nav" v-if="!show">
                <span
                    v-for="(item, index) in nav"
                    :key="index.id"
                    @click="handleRouter(index)"
                    >{{ item }}</span
                >
            </div>
        </div>
    </el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
@Component({
    name: "headerWarp",
})
export default class headerWarp extends Vue {
    /**
     * vue2.6版本 javascript写法
     * @prop
     */
    @Prop({ default: "项目名称" }) private name!: string;
    @Prop({ default: "" }) private text!: string;
    @Prop({ default: "" }) private route!: string;
    @Prop({ default: "" }) private maybe!: string;
    @Prop({ default: true }) private show!: boolean;

    /**
     * vue2.6版本 javascript写法
     * @data
     * @return
     */
    private nav: Array<string> = ["注册", "登录"];

    /**
     * vue2.6版本 javascript写法
     * @methods
     */
    private handle_where(route: string): void {
        this.$router.push({
            name: route,
        });
    }
    private handleRouter(index: number): void {
        if (index == 0) {
            this.$router.push({
                name: "register",
            });
        } else {
            this.$router.push({
                name: "login",
            });
        }
    }
}
</script>
<style scoped lang="scss">
.login-header {
    width: 100%;
    .header {
        box-sizing: border-box;
        padding: 0px 120px 0 60px;
        width: 100%;
        height: 60px;
        box-shadow: 1px 1px 10px 0px rgba(54, 54, 54, 0.17);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .logo {
            display: flex;
            align-items: center;
            img {
                width: 30px;
                height: 30px;
                display: block;
                margin-right: 10px;
            }
            h1 {
                font-size: 26px;
                font-family: Source Han Sans CN;
                color: rgba(51, 51, 51, 1);
            }
        }
        .warp_control {
            color: #333;
            span {
                font-size: 16px;
                &:last-child {
                    color: #63a7f8;
                    cursor: pointer;
                    padding: 0px 5px;
                    box-sizing: border-box;
                }
            }
        }
        .nav {
            font-size: 16px;
            span {
                box-sizing: border-box;
                color: #63a7f8;
                padding: 0 10px;
                cursor: pointer;
                &:first-child {
                    border-right: 1px solid #333;
                }
            }
        }
    }
}
</style>
