const path = require("path");
module.exports = {
	outputDir: "dist",
	assetsDir: "static",
	lintOnSave: false,
	publicPath: "/",
	configureWebpack: () => {
		if (process.env.NODE_ENV === "development") {
			return {
				devServer: {
					proxy: {
						"/api": {
							target: "https://api.chuangwai.xyz/chinese",
							changeOrigin: true,
							secure: false,
							pathRewrite: {
								"^/api": "",
							},
						},
						"/pay": {
							target: "https://pay.chuangwai.xyz/chinese",
							changeOrigin: true,
							secure: false,
							pathRewrite: {
								"^/pay": "",
							},
						},
					},
					// public: "127.0.0.1:8901", // For docker host
					watchOptions: {
						poll: true,
						ignored: /(node_modules|dist|build|vendor|Docker|tests|backup|\.lock|\.git)/,
					},
					disableHostCheck: true,
					historyApiFallback: true,
				},
				devtool: "source-map",
			};
		} else if (process.env.NODE_ENV === "production") {
			return {
				devServer: {
					// proxy: {
					//     "/prodApi": {
					//         target: "https://api.chuangwai.xyz/chinese",
					//         changeOrigin: true,
					//         secure: false,
					//         pathRewrite: {
					//             "^/prodApi": ""
					//         }
					//     },
					//     "/prodPay": {
					//         target: "https://pay.chuangwai.xyz/chinese",
					//         changeOrigin: true,
					//         secure: false,
					//         pathRewrite: {
					//             "^/prodPay": ""
					//         }
					//     }
					// },
					public: "127.0.0.1:8901", // For docker host
					watchOptions: {
						poll: true,
						ignored: /(node_modules|dist|build|vendor|Docker|tests|backup|\.lock|\.git)/,
					},
					disableHostCheck: true,
					historyApiFallback: true,
				},
				devtool: "source-map",
			};
		}
	},
	chainWebpack: (config) => {
		const svgRule = config.module.rule("svg");
		svgRule.uses.clear();
		config.resolve.alias.set("@", path.resolve("src"));
		config.module
			.rule("svg")
			.test(/\.svg$/)
			.include.add(path.resolve("src/icons"))
			.end()
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.options({
				symbolId: "icon-[name]",
			});
	},
};
