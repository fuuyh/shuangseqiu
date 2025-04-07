<template>
	<view class="content">
		<template v-if="!isLoading">
			<view class="header"></view>
			<view class="card">
				<view class="title">
					大数据分析 {{ dqqh }} 期预测
				</view>
				<view class="gg_content">
					<view class="gg_item" v-for="(item,index) in dsjhm" :key="index">
						<text>{{ item }}</text>
					</view>
					<view class="gg_item gg_item_blue">
						<text>{{ dsjhml }}</text>
					</view>
				</view>
				<view class="gg_footer">
					<button type="button" @click="getDJHM('0')">分析预测</button>
				</view> 
			</view>
			<view class="card">
				<view class="title">
					AI机选 {{ dqqh }} 期预测
				</view>
				<view class="gg_content">
					<view class="gg_item" v-for="(item,index) in jxhm" :key="index">
						<text>{{ item }}</text>
					</view>
					<view class="gg_item gg_item_blue">
						<text>{{ jxhml }}</text>
					</view>
				</view>
				<view class="gg_footer">
					<button type="button" @click="getDJHM('1')">分析预测</button>
				</view>
			</view>
			<view class="card">
				<view class="title">
					周易六十四卦 {{ dqqh }} 期预测
				</view>
				<view class="gg_content">
					<view class="gg_item" v-for="(item,index) in zyhm" :key="index">
						<text>{{ item }}</text>
					</view>
					<view class="gg_item gg_item_blue">
						<text>{{ zyhml }}</text>
					</view>
				</view>
				<view class="gg_footer">
					<button type="button" @click="getDJHM('2')">分析预测</button>
				</view>
			</view>
			<view class="card">
				<view class="title">
					六爻卦 {{ dqqh }} 期预测
				</view>
				<view class="gg_content">
					<view class="gg_item" v-for="(item,index) in lyhm" :key="index">
						<text>{{ item }}</text>
					</view>
					<view class="gg_item gg_item_blue">
						<text>{{ lyhml }}</text>
					</view>
				</view>
				<view class="gg_footer">
					<button type="button" @click="getDJHM('3')">分析预测</button>
				</view>
			</view>
			<view class="card">
				<view class="title">
					穿越者 {{ dqqh }} 期预测
				</view>
				<view class="gg_content">
					<view class="gg_item" v-for="(item,index) in cyzhm" :key="index">
						<text>{{ item }}</text>
					</view>
					<view class="gg_item gg_item_blue">
						<text>{{ cyzhml }}</text>
					</view>
				</view>
				<view class="gg_footer">
					<button type="button" @click="getDJHM('4')">分析预测</button>
				</view>
			</view>
			<view class="hr">
				- 以上分析结果仅供参考 -
			</view>
		</template>
		<loadingVue v-else />

		<!-- <canvas canvas-id="h5Canvas" :style="{position: 'absolute', left: '-9999px'}"></canvas> -->
		<uni-popup @maskClick="closePopup" style="height: 75vh;" background-color="#fff" ref="popup" type="bottom"
			border-radius="10px 10px 0 0">
			<fShareVue class="preview-box" id="captureBox" :data="filteredData" :qh="dqqh" />
			<button @click="generateImage" v-if="filteredData.length > 0">保存图片</button>
		</uni-popup>
	</view>
</template>

<script setup>
	import loadingVue from '../../component/loading.vue';
	import fShareVue from '../../component/f-share.vue';
	import { appId,AuthorizationKey } from '../../config/index.js'
	// import html2canvas from 'html2canvas'
	import {
		onNavigationBarButtonTap
	} from '@dcloudio/uni-app'
	import {
		onMounted,
		ref
	} from 'vue';
	const dsjhm = ref(['*', '*', '*', '*', '*', '*'])
	const jxhm = ref(['*', '*', '*', '*', '*', '*'])
	const zyhm = ref(['*', '*', '*', '*', '*', '*'])
	const lyhm = ref(['*', '*', '*', '*', '*', '*'])
	const cyzhm = ref(['*', '*', '*', '*', '*', '*'])
	const dsjhml = ref('*')
	const jxhml = ref('*')
	const zyhml = ref('*')
	const lyhml = ref('*')
	const cyzhml = ref('*')
	const dqqh = ref("2025036")
	const lshm = ref([])

	const isLoading = ref(false)
	onMounted(() => {
		dqqh.value = Number(uni.getStorageSync("zxhm")) + 1
		lshm.value = uni.getStorageSync("lshm")
	})

	const getDJHM = (type) => {
		const data = {
			input: {
				prompt: "获取双色球中奖号码",
				biz_params: {
						type,
						qh: dqqh.value,
						ls: JSON.stringify(lshm.value)
					// user_defined_params: {
					// }
				},
				parameters: {
					
				has_thoughts: true
				}
			}
		}
		isLoading.value = true
		uni.request({
			url: `https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`,
			method: 'POST',
			data: data,
			header: {
				"Authorization": AuthorizationKey,
				"Content-Type": "application/json"
			},
			timeout: 600000,
			success: async (res) => {
				// 数据处理
				console.log(res, '[[[[]]]]')
				if (res.statusCode == 200) {
					const cljg = JSON.parse(res.data.output.text)
					await setResNum(type, cljg)
				} else {
					isLoading.value = false
					uni.showToast({
						mask: true,
						title: "请求失败"
					})
				}
			},
			fail: (err) => {
				isLoading.value = false
				console.error('请求失败：', err);
				uni.showToast({
					mask: true,
					title: "请求失败" + err
				})

			}
		})
	}

	const setResNum = (type, res) => {
	    console.log('设置号码', res)
	    
	    // 新增解析逻辑
	    const parseNumbers = (str) => {
	        const match = str.match(/\[([\d,\s]+)\]/);
	        if (!match) return [];
	        return match[1].split(',').map(num => parseInt(num.trim(), 10));
	    };
	
	    const redBalls = parseNumbers(res.res.split('\n')[0]); // 解析红球
	    const blueBalls = parseNumbers(res.res.split('\n')[1]); // 解析蓝球
	
	    switch (type) {
	        case "0":
	            dsjhm.value = redBalls;
	            dsjhml.value = blueBalls[0];
	            break;
	        case "1":
	            jxhm.value = redBalls;
	            jxhml.value = blueBalls[0];
	            break;
	        case "2":
	            zyhm.value = redBalls;
	            zyhml.value = blueBalls[0];
	            break;
	        case "3":
	            lyhm.value = redBalls;
	            lyhml.value = blueBalls[0];
	            break;
			case "4":
				cyzhm.value = redBalls
				cyzhml.value = blueBalls[0];
	    }
	    isLoading.value = false;
	}

	const popup = ref()
	
	const filteredData = ref([])

	// 导出结果
	onNavigationBarButtonTap((e) => {
		// 设置数据给组件
		filteredData.value = collectData();
		popup.value.open()
		uni.hideTabBar()
	})
	
	const collectData = () => {
	  const result = [];
	
	  // 定义检查函数
	  const checkValid = (redArray, blue) => {
	    // 红球必须全不为空且非'*'，蓝球也不能为'*'
	    return (
	      redArray.every(item => item !== '*') && 
	      blue !== '*' && 
	      redArray.length === 6 // 确保红球有6个
	    );
	  };
	
	  // 遍历每个预测类型
	  const types = [
	    { 
	      type: '大数据', 
	      red: dsjhm.value, 
	      blue: dsjhml.value 
	    },
	    { 
	      type: 'AI机选', 
	      red: jxhm.value, 
	      blue: jxhml.value 
	    },
	    { 
	      type: '周易', 
	      red: zyhm.value, 
	      blue: zyhml.value 
	    },
	    { 
	      type: '六爻', 
	      red: lyhm.value, 
	      blue: lyhml.value 
	    },
	    { 
	      type: '穿越者', 
	      red: cyzhm.value, 
	      blue: cyzhml.value 
	    }
	  ];
	
	  types.forEach(typeObj => {
	    if (checkValid(typeObj.red, typeObj.blue)) {
	      result.push({
	        hq: typeObj.red,
	        lq: typeObj.blue,
	        type: typeObj.type
	      });
	    }
	  });
	
	  return result;
	};
	
	const closePopup = () => {
		uni.showTabBar()
	}


	const currentQH = ref('2023150')
	const redBalls = ref(['02', '08', '15', '23', '27', '30'])
	const blueBall = ref('12')

	// 专为H5优化的保存方法
	const h5SaveImage = (dataURL) => {
		// 方法1：直接下载（受同源策略限制）
		try {
			const link = document.createElement('a')
			link.download = `lottery-${currentQH.value}.png`
			link.href = dataURL
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			uni.showToast({
				title: '开始下载，请稍候'
			})
		} catch (e) {
			// 方法2：新窗口打开另存为
			console.warn('直接下载失败，改用新窗口方式')
			window.open(dataURL, '_blank')
			uni.showToast({
				title: '右键图片另存为',
				icon: 'none',
				duration: 3000
			})
		}
	}

	const generateImage = async () => {
		try {
			// 获取目标节点
			const captureBox = document.querySelector('#captureBox')
			if (!captureBox) {
				throw new Error('未找到需要生成图片的 DOM 节点')
			}

			// 使用 html2canvas 渲染 DOM 内容到 Canvas
			const canvas = await window.html2canvas(captureBox, {
				scale: window.devicePixelRatio || 1, // 提高清晰度
				useCORS: true, // 支持跨域图片
				logging: false // 关闭日志
			})

			// 将 Canvas 转换为 Data URL
			const dataURL = canvas.toDataURL('image/png')

			// 调用保存方法
			h5SaveImage(dataURL)
		} catch (err) {
			console.error('生成失败:', err)
			uni.showToast({
				title: `保存失败：${err.message}`,
				icon: 'none'
			})
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		height: 30px;
	}

	.hr {
		color: #8b939a;
		margin: 20px auto;
		text-align: center;
		font-size: 14px;
	}

	.card {
		width: 85%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 10px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;

		&>view {
			margin: 5px 0;
		}

		.title {
			font-size: 20px;
			font-weight: 500;
		}
	}

	.gg_footer {
		width: 100%;

		button {
			width: 80%;
			// background: #161528;
			background: rgba(255, 0, 0, 0.8);;
			color: #fff;
			border-radius: 25px;
			font-size: 14px;
		}
	}

	.gg_content {
		display: flex;
		align-items: center;
		// justify-content: center;
		justify-content: flex-start;

		.gg_item {
			background: #f00;
			padding: 5px;
			border-radius: 50%;
			color: #fff;
			margin: 0 3px;
			width: 20px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.gg_item_blue {
			background-color: #2d58a7;
		}
	}
</style>