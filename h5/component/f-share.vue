<template>
	<view class="bg">

		<view class="top bgred"></view>
		<view class="center">
			<view style="font-size: 24px;text-align: center;padding: 30px;padding-bottom: 3px;font-weight: bold;">中国福利彩票
				双色球
			</view>
			<view style="font-size: 22px;text-align: center;padding: 30px;padding-top: 0;color: #252424;">
				{{ formattedTime }} {{ qh }}期
			</view>
			<table border="1" v-if="data.length">
				<tbody>
					<tr>
						<th>中奖号码</th>
						<th>引擎</th>
					</tr>
					<tr v-for="(item,index) in data" :key="index">
						<td class="zjhm">
							{{ item.hq.join(', ') }}-{{ item.lq }}
						</td>
						<td>{{ item.type }}</td>
					</tr>
				</tbody>
			</table>
			<view class="createBy">
				<view class="sjly">
					<!-- <br /> -->
					1. 分析引擎基于deepsekk-r1本地部署
					<br />
					2. 历史中奖数据由kaijiang.500.com提供
					<br />
					<!-- 3. 应用由UniApp+vue3搭建 -->
					3. 生成结果仅供娱乐参考
					<br />
					4. power-by@Fuyh
					<br />
				</view>
				<!-- 				<view class="author">
					@Fuyh
				</view> -->
			</view>
		</view>
		<view class="bottom bgred"></view>
	</view>
</template>

<script setup>
	import {
		defineProps,
		ref,
		onMounted
	} from 'vue';
	const props = defineProps({
		data: {
			type: Array,
			default: () => []
		},
		qh: {
			type: String,
			default: ''
		}
	})

	// 获取档期时间
	const formattedTime = ref('');

	const formatTime = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		return `${year}.${month}.${day}-${hours}:${minutes}:${seconds}`;
	};

	// 初始化时间
	onMounted(() => {
		formattedTime.value = formatTime();
		// 实时更新（每秒触发）
		// setInterval(() => {
		//   formattedTime.value = formatTime();
		// }, 1000);
	});
</script>

<style lang="scss" scoped>
	.bg {
		width: 100vw;
		background: url('/static/bgLogo.png') no-repeat center;
		// background-position: 50% 25%;
	}

	.center {
		height: calc(65vh - 40rpx);
		position: relative;

		.createBy {
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 15%;
			overflow: hidden;

			.sjly {
				padding: 0 10px;
				color: #aaa6a6;
				font-size: 14px;
			}

			.author {
				text-align: right;
				color: #aaa6a6;
			}
		}
	}

	.bgred {
		height: 20rpx;
		width: 100%;
		background-color: #d61518;
	}

	table {
		border-collapse: collapse;
		width: 90%;
		border: 1px solid #979797;
		font-size: 20px;
		color: #231815;
		margin-bottom: 24px;
		margin: 0 auto;
		text-align: center;

		tr {
			height: 60px;
			border: 1px solid #979797;

			th {
				letter-spacing: 8px;
				background-color: #F2F2F6;
				border: 1px solid #979797;
				font-weight: bold;
				text-align: center;
			}
		}

		.zjhm {
			font-weight: 700;
		}
	}
</style>