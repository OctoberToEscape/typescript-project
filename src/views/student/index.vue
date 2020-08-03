<template>
    <el-container class="student-index">
        <div class="bookshelf">
            <div
                class="caurse-block"
                v-for="(c, index) in courseList"
                :class="['caurse-block' + (index + 1)]"
                :key="index"
            >
                <span
                    v-if="c.is_buy === 1"
                    @click="keepCategoryId(c.id, index)"
                    >{{ c.title }}</span
                ><span class="disabled" v-else="v-else">{{ c.title }}</span>
            </div>
            <div class="caurse-block about-us">
                <span>
                    <router-link
                        target="_blank"
                        tag="a"
                        :to="{
                            name: 'aboutAs',
                            query: { flag: 3, from: 'about' },
                        }"
                        >关于我们</router-link
                    >
                </span>
            </div>
        </div>
    </el-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getProducts } from "@/api/student/index";
@Component({
    name: "student-index",
})
export default class StudentIndex extends Vue {
    /**
     * @data
     * @return
     */
    private courseList: Array<{ [key: string]: number | string }> = [];
    private courseLinks: Array<string> = [
        "jambic",
        "poetry",
        "historyBase",
        "global",
        "studyTour",
        "writing",
    ];
    /**
     * @methods
     */
    private keepCategoryId(id: string, ind: number): void {
        this.$router.push({ name: this.courseLinks[ind] });
        sessionStorage.setItem("studentCategoryId", id);
    }
    created() {
        getProducts().then((res: any): void => {
            this.courseList = res.data;
        });
    }
}
</script>
<style lang="scss" scoped>
.student-index {
    .bookshelf {
        position: relative;
        width: 1104px;
        height: 694px;
        margin: 100px auto 0;
        background: url("~@/assets/images/bookshelf.png") no-repeat;
        background-size: 100% 100%;
        .caurse-block {
            position: absolute;
            span {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                background: #ffd328;
                color: #0d5593;
                font-size: 46px;
                line-height: 100%;
                cursor: pointer;
            }
            span:hover {
                background: #ffde28;
            }
            span.disabled {
                background: #e0e0e0;
                color: #999;
                cursor: not-allowed;
            }
        }
        .caurse-block1 {
            width: 160px;
            height: 140px;
            top: 19px;
            left: 234px;
        }
        .caurse-block2 {
            width: 178px;
            height: 140px;
            top: 19px;
            left: 629px;
        }
        .caurse-block3 {
            width: 216px;
            height: 135px;
            top: 178px;
            left: 509px;
        }
        .caurse-block4 {
            width: 198px;
            height: 135px;
            top: 178px;
            left: 742px;
            span {
                padding: 0 50px;
            }
        }
        .caurse-block5 {
            width: 198px;
            height: 135px;
            top: 333px;
            left: 347px;
        }
        .caurse-block6 {
            width: 234px;
            height: 135px;
            top: 333px;
            left: 562px;
        }
        .caurse-block.about-us {
            width: 216px;
            height: 137px;
            top: 488px;
            left: 720px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            span {
                width: 100px;
                height: 26px;
                line-height: 16px;
                border-radius: 4px;
            }
            a {
                font-size: 16px;
                text-decoration: none;
                color: #0d5593;
            }
        }
    }
}
</style>
