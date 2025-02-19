<script setup lang="ts">
	import { watch, ref } from 'vue';
	// https://pinyin-pro.cn/use/html.html
	import { html } from 'pinyin-pro';
	import { GUSHI_LIST } from '../constant/index';

	const prevAudio = ref<HTMLAudioElement | null>(null);
	const visible = ref<boolean>(false);
	const activeKey = ref<string>('');
	const scrollTop = ref<number>(0)
	const scrollIntoId = ref<string>('')

	let audios = []

	watch(visible, (newVal) => {
		if (!newVal) {
			activeKey.value = '';
		}
	});

	const data = GUSHI_LIST.map((i) => {
		return {
			key: i.name,
			poem: i.poem.map((item) => html(item)),
			translation: i.translation.map((item) => html(item)),
			desc: html(i.desc),
			link: i.link,
			audio: i.audio,
		};
	});

	const playAudio = (url : string) => {
		if (audios?.length) {
			audios.forEach(i => {
				i.pause()
			})
			audios = []
		}
		const audio = wx.createInnerAudioContext(); // 创建音频上下文
		audio.src = url;
		audio.play();
		audios.push(audio)
	};

	const stopAudio = () => {
		if (audios?.length) {
			audios.forEach(i => {
				i.pause()
			})
			audios = []
		}
	};

	const onRefresh = () => {
		location.reload();
	};

	const onScrollTo = () => {
		scrollIntoId.value = 'poem-0';
	};

	const onShow = () => {
		visible.value = true;
	};

	const onClose = () => {
		visible.value = false;
	}

	const onJumpTo = (index : number, key : string) => {
		activeKey.value = key;
		scrollIntoId.value = `poem-${index}`
	};

	const onScroll = (e : any) => {
		scrollIntoId.value = '';
		scrollTop.value = e.detail.scrollTop;
	}
</script>

<template>
	<scroll-view :scroll-into-view="scrollIntoId" :scroll-into-view-offset="0" class="home-wrap" ref="scrollRef"
		scroll-y="true" enable-passive @scroll="onScroll">
		<div v-for="(item, index) in data" :key="item.key" class="poems-item" :id="`poem-${index}`">
			<div class="poems">
				<div v-for="(i, index) in item.poem" :key="index" class="text" v-html="i" />
			</div>
			<div class="actions">
				<u-button type="primary" @click="playAudio(item.audio)">开始朗读</u-button>
				<u-button type="warning" @click="stopAudio">停止朗读</u-button>
			</div>
			<div class="translations yiwen">
				<!-- <a class="link" v-html="html('译文(古诗翻译)')" :href="item.link" /> -->
				<div class="desc" v-html="html('译文(古诗翻译)')" />
				<div v-for="(i, index) in item.translation" :key="index" class="translation" v-html="i" />
			</div>
			<div class="translations">
				<div class="desc" v-html="html('诗人的思想表达')" />
				<div class="translation" v-html="item.desc" />
			</div>
		</div>
		<div v-if="scrollTop > 500" class="up" @click="onScrollTo">
			<u-icon name="arrow-upward" size="28"></u-icon>
		</div>
		<div class="menu" @click="onShow">
			<u-icon name="list-dot" size="28"></u-icon>
		</div>
		<u-popup :show="visible" mode="bottom" @close="onClose">
			<view class="menu-header">
				<text>诗词目录</text>
				<div class="menu-close" @click="onClose">
					<u-icon name="close" size="20"></u-icon>
				</div>
			</view>
			<scroll-view scroll-y="true" enable-passive class="menu-list">
				<div v-for="(item, index) in GUSHI_LIST" :key="item.name">
					<div :class="`menu-item ${activeKey === item.name ? 'active' : ''}`" @click="onJumpTo(index, item.name)">
						<span class="num">{{ index + 1 }}.</span>
						{{ item.name }}
					</div>
				</div>
			</scroll-view>
		</u-popup>
	</scroll-view>
</template>

<style scoped lang="less">
	.home-wrap {
		text-align: center;
		background-color: #d4d2be;
		box-sizing: border-box;
		overflow: auto;
		height: 100vh;

		.poems-item {
			background-color: #f0efe3;
			margin-bottom: 15px;

			.poems {
				padding: 10px;
				font-size: 20px;

				& .text:nth-child(2) {
					:deep {
						.py-result-item {
							.py-pinyin-item {
								font-size: 15px;
							}

							.py-chinese-item {
								font-size: 16px;
							}
						}
					}
				}
			}

			.actions {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 5px;
				margin-right: 10px;
				padding: 0 50px;

				:deep {
					.u-button {
						&:first-child {
							margin-right: 10px;
						}
					}
				}
			}

			.translations {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				margin-top: 10px;
				padding: 10px;

				.link,
				.desc {
					margin-bottom: 10px;
					color: #5782ff;

					:deep {
						.py-chinese-item {
							font-weight: 500;
						}
					}
				}

				.desc {
					color: unset;
				}

				.translation {
					text-align: left;
					font-size: 14px;

					:deep {
						.py-result-item {
							display: inline-block;
							margin-bottom: 5px;
							margin-right: 6px;

							.py-pinyin-item {
								font-size: 17px;
								margin-bottom: 3px;
							}

							.py-chinese-item {
								font-size: 18px;
							}
						}
					}
				}
			}

			.yiwen {
				border-top: 1px dashed #d4d2be;
				border-bottom: 1px dashed #d4d2be;
			}
		}

		.up,
		.menu {
			display: flex;
			align-items: center;
			justify-content: center;
			position: fixed;
			right: 20px;
			bottom: 30px;
			background-color: rgba(212, 210, 190, 0.8);
			box-shadow: 0 0 10px #f0efe3;
			padding: 5px;
			cursor: pointer;
			z-index: 999;
			width: 30px;
			height: 30px;
			border-radius: 5px;

			.icon-refresh {
				font-size: 18px;
			}
		}

		.up {
			right: 20px;
			bottom: 80px;

			.icon-mulu {
				font-size: 20px;
			}
		}

		.menu-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 50px;
			padding-left: 10px;
			font-size: 18px;
			font-weight: 600;
			background-color: #f0efe3;
			border-bottom: 1px solid #d4d2be;
		}

		.menu-close {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			width: 50px;

			:deep {
				.u-icon__icon {
					margin-right: -12px;
				}
			}
		}

		.menu-list {
			box-sizing: border-box;
			height: 300px;
			overflow: auto;
			background-color: #f0efe3;

			.menu-item {
				display: block;
				padding: 10px;
				border-bottom: 1px solid #dbdacb;
				color: #5782ff;
				text-align: left;

				.num {
					margin-right: 5px;
				}
			}

			.active {
				background-color: #dbdacb;
			}
		}

		:deep {
			.py-result-item {
				margin-right: 6px;

				.py-pinyin-item {
					font-size: 18px;
					margin-bottom: 3px;
				}

				.py-chinese-item {
					font-size: 20px;
				}
			}
		}
	}

	:deep {
		.u-safe-bottom {
			background-color: #f0efe3;
		}
	}
</style>