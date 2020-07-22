export default {
    install(Vue: any) {
        Vue.prototype.successMes = function(text: any) {
            this.$message({
                message: text,
                type: "success",
            });
        };
        Vue.prototype.errorMes = function(text: any) {
            this.$message.error(text);
        };
        Vue.prototype.tipMes = function(text: any) {
            this.$message({ message: text });
        };
    },
};
