<template>
    <el-container class="interpretation">
        <el-header class="top-header">
            <div class="logo">
                <div class="logo-img"></div>
                <h1>白鹿洞大语文学习平台</h1>
            </div>
        </el-header>
        <el-main class="content">
            <el-container class="student-nav-container">
                <el-header class="student-tab-header">
                    <div class="title">{{ title }}</div>
                </el-header>
                <el-main class="student-tab-content">
                    <div class="tab-content-box" v-html="content"></div>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getClause } from "@/api/login/login";
@Component({
    name: "columnDeclare",
})
export default class columnDeclare extends Vue {
    private title: string = "";
    private content: string = "";

    created() {
        getClause(this.$route.query.id).then((res: any): void => {
            this.title = res.data.data.title;
            const regex = new RegExp("<img", "gi");
            res.data.data.content = res.data.data.content.replace(
                regex,
                `<img style="width: 100%; height: auto"`
            );
            this.content = res.data.data.content;
        });
    }
}
</script>
<style lang="scss" scoped>
.interpretation {
    height: 100vh;
    width: 100%;
    min-width: 1200px;
    overflow-x: scroll;
    .top-header {
        background: #63a7f8;
        .logo {
            display: flex;
            align-items: center;
            margin-top: 16px;
            cursor: pointer;
            .logo-img {
                width: 29px;
                height: 29px;
                background: url(~@/assets/images/logo2.png) no-repeat;
                background-size: contain;
            }
            h1 {
                font-size: 22px;
                font-weight: 500;
                color: #fff;
                line-height: 29px;
                margin-left: 9px;
            }
        }
    }
    .content {
        background: url("~@/assets/images/student_bg.jpg") no-repeat;
        background-size: cover;
    }
}
.student-nav-container {
    margin-bottom: 100px;
    .student-tab-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 66px !important;
        .title {
            box-sizing: border-box;
            max-width: 869px;
            height: 66px;
            padding: 28px 60px 0;
            font-size: 26px;
            background: url("~@/assets/images/title_bg.png") bottom center
                no-repeat;
            background-size: cover;
            color: #fff;
            line-height: 1;
            white-space: nowrap;
            overflow: hidden;
        }
    }
    .student-tab-content {
        background: #f6fafe;
        border-radius: 20px;
        padding: 22px;
        .tab-content-box {
            width: 100%;
            box-sizing: border-box;
            padding: 29px;
            background: #d3e9fb;
            border-radius: 16px;
            font-size: 16px;
            color: #333;
            img {
                width: 100%;
                margin: 10px auto;
            }
        }
    }
}
@media screen and (min-width: 1208px) {
    .student-nav-container {
        margin: 0 121px 100px 118px;
    }
}
</style>
