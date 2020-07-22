<template>
    <el-tabs v-model="active" :class="styleClass" @tab-click="handleClick">
        <el-tab-pane
            v-for="(tab, index) in tabLists"
            :key="tab.id"
            :name="tab.id"
        >
            <div class="tab-inner" slot="label">{{ tab.category_name }}</div>
        </el-tab-pane>
    </el-tabs>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
@Component({
    name: "studentTab",
})
export default class StudentTag extends Vue {
    @Prop() private tabLists!: Array<any>;
    @Prop() private activeTab!: string;
    @Prop() private styleClass!: string;

    private active: any = null;

    private handleClick(tab: any): void {
        sessionStorage.setItem("tab-index", tab.index);
    }

    @Watch("activeTab")
    private changeActiveTab(v: string): void {
        this.active = v;
    }

    @Watch("active")
    private changeActive(v: any): void {
        this.$emit("activeChange", v);
    }
}
</script>
<style lang="scss">
.student-tab1 {
    .el-tabs__header {
        margin: 0;
        .el-tabs__nav-wrap::after,
        .el-tabs__active-bar {
            display: none;
        }
        .el-tabs__nav {
            float: none;
            display: flex;
            justify-content: center;
            align-items: flex-end;
        }
        .el-tabs__item {
            position: relative;
            width: 110px;
            text-align: center;
            padding: 0;
            color: #fff;
            border-style: solid;
            font-size: 20px;
            .tab-inner {
                position: absolute;
                width: 110px;
                height: 30px;
                line-height: 1;
            }
        }
        .el-tabs__item:nth-child(9n + 0) {
            border-color: transparent #e87cc1 #e87cc1 transparent;
            border-width: 23px 110px 24px 0;
            .tab-inner {
                bottom: -24px;
            }
        }
        .el-tabs__item:nth-child(9n + 1) {
            border-color: transparent #dd5958 #dd5958 transparent;
            border-width: 8px 110px 32px 0;
            .tab-inner {
                bottom: -32px;
            }
        }
        .el-tabs__item:nth-child(9n + 2) {
            border-color: transparent #f77a2f #f77a2f transparent;
            border-width: 8px 110px 32px 0;
            .tab-inner {
                bottom: -32px;
            }
        }
        .el-tabs__item:nth-child(9n + 3) {
            border-color: transparent #f3c30a #f3c30a transparent;
            border-width: 25px 110px 28px 0;
            transform: rotateY(180deg);
            .tab-inner {
                bottom: -28px;
                transform: rotateY(-180deg);
            }
        }
        .el-tabs__item:nth-child(9n + 4) {
            border-color: transparent #0d80e0 #0d80e0 transparent;
            border-width: 8px 110px 32px 0;
            .tab-inner {
                bottom: -32px;
            }
        }
        .el-tabs__item:nth-child(9n + 5) {
            border-color: transparent #5c58dd #5c58dd transparent;
            border-width: 17px 110px 28px 0;
            transform: rotateY(180deg);
            .tab-inner {
                bottom: -28px;
                transform: rotateY(-180deg);
            }
        }
        .el-tabs__item:nth-child(9n + 6) {
            border-color: transparent #2dad8d #2dad8d transparent;
            border-width: 23px 110px 26px 0;
            .tab-inner {
                bottom: -26px;
            }
        }
        .el-tabs__item:nth-child(9n + 7) {
            border-color: transparent #895de9 #895de9 transparent;
            border-width: 8px 110px 32px 0;
            .tab-inner {
                bottom: -32px;
            }
        }
        .el-tabs__item:nth-child(9n + 8) {
            border-color: transparent #cd56e5 #cd56e5 transparent;
            border-width: 25px 110px 28px 0;
            transform: rotateY(180deg);
            .tab-inner {
                bottom: -28px;
                transform: rotateY(-180deg);
            }
        }

        .el-tabs__item.is-active {
            border-color: transparent #fff #fff transparent;
            color: #63a7f8;
        }
    }
}
.student-tab2 {
    .el-tabs__header {
        margin: 0;
        .el-tabs__nav-wrap::after,
        .el-tabs__active-bar {
            display: none;
        }
        .el-tabs__nav {
            float: none;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            .el-tabs__item {
                width: 110px;
                text-align: center;
                padding: 0;
                color: #fff;
                font-size: 20px;
            }
            .el-tabs__item:nth-last-child(3) {
                background: #f77a2f;
                height: 35px;
                line-height: 35px;
            }
            .el-tabs__item:nth-last-child(2) {
                background: #0d80e0;
                height: 48px;
                line-height: 48px;
            }
            .el-tabs__item:nth-last-child(1) {
                background: #2dad8d;
                height: 68px;
                line-height: 68px;
            }

            .el-tabs__item.is-active {
                background: #fff;
                color: #63a7f8;
            }
        }
    }
}
</style>
