<template>
    <div
        class="page-header"
        :style="{ background: from ? '#63a7f8' : '#99cefa' }"
    >
        <div class="contral" @click="onBack">
            <img src="@/assets/images/handleback.png" />
            <span>返回{{ backName }}</span>
        </div>
        <div class="title">{{ title }}</div>
        <div
            :class="controlShow ? 'player' : 'no_player'"
            @click="onVideoClick"
        >
            <img
                :src="
                    show
                        ? require('@/assets/images/pause_icon.png')
                        : require('@/assets/images/play_icon.png')
                "
            />
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
    name: "tag-header",
})
export default class extends Vue {
    @Prop({ default: "" }) private backName!: string;
    @Prop({ default: "" }) private title!: string;
    @Prop({ default: true }) private show!: boolean;
    @Prop({ default: false }) private controlShow!: boolean;
    @Prop({ default: false }) private from!: boolean;

    /**
     * @data
     * @return
     */
    private playIsok: boolean = this.show;

    /**
     * @methods
     */
    private onBack(): void {
        this.$emit("_onBack");
    }
    private onVideoClick(): void {
        this.playIsok = !this.playIsok;
        this.$emit("_onVideoClick", this.playIsok);
    }
}
</script>
<style lang="scss" scoped>
.page-header {
    width: 100%;
    height: 50px;
    // background: #63a7f8;
    padding: 0px 130px;
    box-sizing: border-box;
    min-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .contral {
        height: 100%;
        cursor: pointer;
        img {
            width: 11px;
            height: 18px;
            margin-right: 10px;
            vertical-align: middle;
        }
        span {
            color: #fff;
            font-size: 16px;
            vertical-align: middle;
            line-height: 50px;
        }
    }
    .title {
        line-height: 50px;
        color: #fff;
        font-size: 18px;
        font-weight: bold;
    }
    .player,
    .no_player {
        width: 36px;
        height: 36px;
        cursor: pointer;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .no_player {
        opacity: 0;
        z-index: -1;
    }
}
</style>
