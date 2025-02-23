<template>
	<div v-if="!poemList.length" class="home-wrap-loading">
		<u-loading-icon vertical size="38" text="诗词正在加载中" color="#5782ff"></u-loading-icon>
	</div>
	<scroll-view v-else :scroll-into-view="scrollIntoId" :scroll-into-view-offset="0" class="home-wrap" ref="scrollRef"
		scroll-y="true" enable-passive @scroll="onScroll">
		<div v-for="(item, index) in ([ ...data, ...toRaw(poemList)])" :key="item.name" class="poems-item"
			:id="`poem-${index}`">
			<div class="poems">
				<div v-for="(i, index) in item.poem" :key="index" class="text" v-html="i" />
			</div>
			<div class="actions">
				<u-button type="primary" :loading="poemStore.isLoadedUrl && poemStore.activeName === item.name"
					loadingText="音频加载中" @click="playAudio(item.audio, item.name)">
					{{poemStore.activeName === item.name ? '正在朗读...' : '开始朗读'}}
				</u-button>
				<u-button type="warning" @click="stopAudio">停止朗读</u-button>
			</div>
			<div class="translations yiwen">
				<div class="desc" v-html="html('译文(古诗翻译)')" />
				<div v-for="(i, index) in item.translation" :key="index" class="translation" v-html="i" />
			</div>
			<div v-if="item.desc" class="translations">
				<div class="desc-wrap">
					<div class="desc" v-html="html('简析 (思想表达)')" />
					<u-icon v-if="item.descAudio" :name="poemStore.audioKeys.includes(item.name) ? 'volume-fill' : 'volume'"
						color="#2979ff" size="30" @click="onActiveDescAudio(item.descAudio, item.name)"></u-icon>
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
				<div v-for="(item, index) in [ ...data, ...toRaw(poemList)]" :key="item.name">
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
	import { watch, ref, markRaw, toRaw, onMounted } from 'vue';
	import { html } from 'pinyin-pro';
	import { onTabItemTap } from '@dcloudio/uni-app';
	import { usePoemStore } from '@/stores';
	import { request } from '@/server'
	import { PoemInfo } from '@/typings/index.d.ts'
	import { playAudio, stopAudio, onActiveDescAudio } from '@/utils'
	import { SENIOR_LIST } from '@/constant/senior';

	const poemStore = usePoemStore();

	const prevAudio = ref<HTMLAudioElement | null>(null);
	const visible = ref<boolean>(false);
	const activeKey = ref<string>('');
	const scrollTop = ref<number>(0)
	const scrollIntoId = ref<string>('')
	const loading = ref<boolean>(false)
	const poemList = ref<PoemInfo[]>([])

	onMounted(() => {
		getPoems();
	})

	const managePoems = (data : PoemInfo[], key : string) => {
		return data.map((i) => {
			return {
				name: i.name,
				poem: i[key].map((item : string) => html(item)),
				translation: i.translation.map((item) => html(item)),
				desc: html(i.desc),
				link: i.link,
				audio: i.audio,
				descAudio: i.descAudio,
			};
		})
	}

	const getPoems = async () => {
		loading.value = true
		const res = await request<{ data : { list : PoemInfo[], total : number }, success : boolean }>({
			url: 'https://www.dnhyxc.cn/api/getPoemListForWechat',
			data: {
				pageNo: 1,
				pageSize: 99999
			}
		})
		loading.value = false
		if (res?.success && res.data?.list?.length) {
			poemList.value = managePoems(res.data?.list, 'poems')
		}
	}

	const data = managePoems(SENIOR_LIST, 'poem');

	watch(visible, (newVal) => {
		if (!newVal) {
			activeKey.value = '';
		}
	});

	onTabItemTap(() => {
		stopAudio();
	});

	const onRefresh = () => {
		location.reload();
	};

	const onScrollTo = () => {
		scrollIntoId.value = 'poem-0';
	};

	const onShow = () => {
		visible.value = true;
	};

	const onAdd = () => {
		console.log('add')
	}

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