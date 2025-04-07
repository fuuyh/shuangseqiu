<template>
	<view class="content">
		<view class="header"></view>
		<view class="gg card">
			<view class="gg_title">
				福彩双色球 {{ cpqs }} 期全国开奖公告
			</view>
			<view class="gg_f_title">
				本期{{ cpqs }} 开奖日期：{{ kjrq }}({{kjxq}})
			</view>
			<view class="gg_content">
				<view class="gg_item" v-for="(item,index) in zxkjhq" :key="index">
					{{ item }}
				</view>
				<view class="gg_item gg_item_blue">
					{{ zxkjlq }}
				</view>
			</view>
		</view>
		<view class="zj card">
			<view class="zj_title">
				<view class="jx">
					奖项
				</view>
				<view class="tj">
					条件
				</view>
<!-- 				<view class="zjzs">
					中奖注数
				</view> -->
				<view class="djje">
					单奖金额
				</view>
			</view>
			<view class="zj_content">
				<view class="row">
					<view class="jx">
						一等奖
					</view>
					<view class="tj">
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdb"></view>
					</view>
<!-- 					<view class="zjzs">
						2
					</view> -->
					<view class="djje">
						浮动奖，最高1000万
					</view>
				</view>
				<view class="row">
					<view class="jx">
						二等奖
					</view>
					<view class="tj">
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdr"></view>
					</view>
	<!-- 				<view class="zjzs">
						79
					</view> -->
					<view class="djje">
						浮动奖
					</view>
				</view>
				<view class="row">
					<view class="jx">
						三等奖
					</view>
					<view class="tj">
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdr"></view>
						<view class="tjdb"></view>
					</view>
<!-- 					<view class="zjzs">
						1179
					</view> -->
					<view class="djje">
						3000
					</view>
				</view>
				<view class="row">
					<view class="jx">
						四等奖
					</view>
					<view class="tj tj2">
						<view class="top">
							<view class="tjdr"></view>
							<view class="tjdr"></view>
							<view class="tjdr"></view>
							<view class="tjdr"></view>
							<view class="tjdr"></view>
						</view>
						<view class="bottom">
							<view class="tjdr"></view>
							<view class="tjdr"></view>
							<view class="tjdr"></view>
							<view class="tjdr"></view>
							<view class="tjdb"></view>
						</view>
					</view>
<!-- 					<view class="zjzs">
						66102
					</view> -->
					<view class="djje">
						200
					</view>
				</view>
				<view class="row">
					<view class="jx">
						五等奖
					</view>
					<view class="tj tj2">
						<view class="top">
							<view class="tjdr"></view>
							<view class="tjdr"></view>
							<view class="tjdr"></view>
							<view class="tjdr"></view>
						</view>
						<view class="bottom">
							<view class="tjdr"></view>
							<view class="tjdr"></view>
							<view class="tjdr"></view>
							<view class="tjdb"></view>
						</view>
					</view>
<!-- 					<view class="zjzs">
						1303555
					</view> -->
					<view class="djje">
						10
					</view>
				</view>
				<view class="row">
					<view class="jx">
						六等奖
					</view>
					<view class="tj tj2">
						<view class="top">
							<view class="tjdr"></view>
							<view class="tjdr"></view>
							<view class="tjdb"></view>
						</view>
						<view class="bottom">
							<view class="tjdr"></view>
							<view class="tjdb"></view>
						</view>
					</view>
<!-- 					<view class="zjzs">
						10929071
					</view> -->
					<view class="djje">
						5
					</view>
				</view>
			</view>
		</view>
		<view class="hr">
			- 福彩双色球往期中奖号码 -
		</view>
		<view class="wq card">
			<view class="wq_item" v-for="(item,i) in wqkjList" :key="i">
				<view class="wq_title">
					<view class="qs">
						第{{ item.qh }}期
					</view>
					<view class="date">
						{{ item.kjrq }}({{ item.day }})
					</view>
				</view>
				<view class="gg_content">
					<view class="gg_item" v-for="(hq,index) in item.hq" :key="index">
						{{ hq }}
					</view>
					<view class="gg_item gg_item_blue">
						{{ item.lq }}
					</view>
				</view>

			</view>
		</view>

		<view class="hr" style="margin-bottom: 0;padding-bottom: 20px;">
			- 暂无更多数据 -
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';

	const cpqs = ref('2025031')
	const kjrq = ref('2025-03-27')
	const kjxq = ref('')
	const zxkjhq = ref([])
	const zxkjlq = ref('')
	const wqkjList = ref([])
	onMounted(() => {
		uni.request({
			// url: 'https://kaijiang.500.com/static/info/kaijiang/xml/ssq/list.xml',
			url: '/api/static/info/kaijiang/xml/ssq/list.xml',
			method: 'GET',
			success: (res) => {
				const data = parseXML(res.data)
				cpqs.value = data[0].qh
				kjrq.value = data[0].kjrq
				zxkjhq.value = data[0].hq
				zxkjlq.value = data[0].lq
				kjxq.value = data[0].day
				wqkjList.value = data
				// 存储到缓存中
				uni.setStorageSync("zxhm",cpqs.value)
				uni.setStorageSync("lshm",wqkjList.value)

			},
			fail: (err) => {
				console.error('请求失败：', err);
			}
		})
	})
	
	// 获取星期几（和Python逻辑一致）
	const getWeekday = (dateStr) => {
	  const date = new Date(dateStr)
	  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
	  return weekdays[date.getDay()] // getDay() 返回 0（周日）到6（周六）
	}
	
	// 解析XML（对应Python的parse_xml）
	const parseXML = (xmlString) => {
	  const parser = new DOMParser()
	  const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
	  const rows = xmlDoc.getElementsByTagName('row')
	  
	  return Array.from(rows).map(row => {
	    const expect = row.getAttribute('expect') || ''
	    const opencode = row.getAttribute('opencode') || ''
	    const opentime = (row.getAttribute('opentime') || '').split(' ')[0]
	    
	    // 拆分红蓝球（和Python逻辑一致）
	    let hq = [], lq = ''
	    if (opencode.includes('|')) {
	      const [redPart, bluePart] = opencode.split('|')
	      hq = redPart.split(',')
	      lq = bluePart
	    }
	    
	    return {
	      qh: `20${expect}`,       // 与Python的'20' + expect一致
	      kjrq: opentime,
	      hq: hq,
	      lq: lq,
	      day: getWeekday(opentime) // 转换星期
	    }
	  }).sort((a, b) => b.kjrq.localeCompare(a.kjrq)) // 按日期降序
	    .slice(0, 100)              // 取前100条
	}
</script>

<style lang="scss" scoped>
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
	}

	.row {
		// margin: 15px 0;
		padding: 15px 0;
	}

	.zj_content {
		width: 100%;
	}

	.zj_title,
	.row {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;

		view {
			width: 33%;
			text-align: center;
		}
	}

	.tj {
		display: flex;
		justify-content: center;
		align-items: center;

		.tjdb,
		.tjdr {
			width: 10px;
			height: 10px;
			background-color: red;
			margin: 0 1px;
			border-radius: 50%;
		}

		.tjdb {
			background-color: #2d58a7;
		}
	}

	.tj2 {
		flex-direction: column;

		.top,
		.bottom {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 6px 0;
		}

	}

	.header {
		height: 30px;
	}

	.gg_title {
		font-size: 20px;
		font-weight: 600;
	}

	.gg_content {
		display: flex;
		align-items: center;
		justify-content: center;

		.gg_item {
			width: 20px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f00;
			padding: 5px;
			border-radius: 50%;
			color: #fff;
			margin: 0 3px;
		}

		.gg_item_blue {
			background-color: #2d58a7;
		}
	}

	/* 	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	} */

	/* 	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	} */
	.wq {
		align-items: flex-start;
		margin-bottom: 0;

		.wq_item {
			border-bottom: 1px solid #8b939a;
			width: 100%;
			padding-bottom: 10px;
			display: flex;
			flex-direction: column;
			// align-items: center;
			    align-items: flex-start;

			.wq_title {
				display: flex;
				padding: 10px 0;

				.qs {
					margin-right: 30px;
				}

				.date {
					color: #8b939a;
				}
			}

			.gg_content {
				justify-content: flex-start;
			}
		}
	}
</style>