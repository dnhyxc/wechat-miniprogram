<template>
	<div v-if="!poemList.length" class="home-wrap-loading">
		<u-loading-icon vertical size="38" text="诗词正在加载中" color="#5782ff"></u-loading-icon>
	</div>
	<scroll-view :scroll-into-view="scrollIntoId" :scroll-into-view-offset="0" class="home-wrap" ref="scrollRef"
		scroll-y="true" enable-passive @scroll="onScroll">
		<div v-for="(item, index) in poemList" :key="item.name" class="poems-item" :id="`poem-${index}`">
			<div class="poems">
				<div v-for="(i, index) in item.poem" :key="index" class="text" v-html="i" />
			</div>
			<div class="actions">
				<u-button type="primary" @click="playAudio(item.audio, item.name)">
					{{toRaw(poemStore.activeName) === item.name ? '正在朗读...' : '开始朗读'}}
				</u-button>
				<u-button type="warning" @click="stopAudio">停止朗读</u-button>
			</div>
			<div class="translations yiwen">
				<!-- <a class="link" v-html="html('译文(古诗翻译)')" :href="item.link" /> -->
				<div class="desc" v-html="html('译文(古诗翻译)')" />
				<div v-for="(i, index) in item.translation" :key="index" class="translation" v-html="i" />
			</div>
			<div v-if="item.desc" class="translations">
				<div class="desc-wrap">
					<div class="desc" v-html="html('简析 (思想表达)')" />
				</div>
				<div class="translation" v-html="item.desc" />
			</div>
		</div>
		<div v-if="scrollTop > 500" class="up" @click="onScrollTo">
			<u-icon name="arrow-upward" size="28" color="#2979ff"></u-icon>
		</div>
		<div class="menu" @click="onShow">
			<u-icon name="list-dot" size="28" color="#2979ff"></u-icon>
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

<script setup lang="ts">
	import { watch, ref, toRaw, onMounted, nextTick } from 'vue';
	import { onTabItemTap } from '@dcloudio/uni-app';
	import { html } from 'pinyin-pro';
	import { usePoemStore } from '@/stores';
	import { playAudio, stopAudio } from '@/utils'
	import { GUSHI_LIST } from '@/constant/base';
	import { PoemInfo } from '@/typings/index.d.ts'
	import AddPoem from '@/components/AddPoem/index.vue'

	const poemStore = usePoemStore();

	const prevAudio = ref<HTMLAudioElement | null>(null);
	const visible = ref<boolean>(false);
	const activeKey = ref<string>('');
	const scrollTop = ref<number>(0)
	const scrollIntoId = ref<string>('')
	const addVisible = ref<boolean>(false)
	const poemList = ref<PoemInfo[]>([])

	onMounted(() => {
		nextTick(() => {
			getPomes()
		})
	})

	onTabItemTap(() => {
		stopAudio();
	});

	watch(visible, (newVal) => {
		if (!newVal) {
			activeKey.value = '';
		}
	});

	const getPomes = () => {
		const data = GUSHI_LIST.map((i : PoemInfo) => {
			return {
				name: i.name,
				poem: i.poem.map((item) => html(item)),
				translation: i.translation.map((item) => html(item)),
				desc: html(i.desc),
				link: i.link,
				audio: i.audio,
				descAudio: i?.descAudio || ''
			}
		})
		poemList.value = toRaw(data)
	}

	const onRefresh = () => {
		location.reload();
	};

	const onScrollTo = () => {
		scrollIntoId.value = 'poem-0';
	};

	const onAdd = () => {
		addVisible.value = true
	}

	const onCloseAdd = () => {
		addVisible.value = false
	}

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

<style scoped lang="scss">
	@import '@/styles/index.scss';
</style>