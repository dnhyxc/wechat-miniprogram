import { defineStore } from 'pinia';

interface IProps {
	audios : WechatMiniprogram.InnerAudioContext[]
	audioKeys : string[],
	activeName : string,
	isAudioReady : boolean,
	loadedUrls : string[],
	isLoadedUrl : boolean,
}

export const usePoemStore = defineStore('poem', {
	state: () : IProps => ({
		audios: [],
		audioKeys: [],
		activeName: '',
		isAudioReady: false,
		loadedUrls: [],
		isLoadedUrl: false
	}),
	actions: {
		setAudios(audio : WechatMiniprogram.InnerAudioContext) {
			this.audios = [audio, ...this.audios]
		},
		clearAudios() {
			this.audios = []
		},
		setAudioKeys(key : string | string[]) {
			if (Array.isArray(key)) {
				this.audioKeys = key
			} else {
				this.audioKeys.push(key)
			}
		},
		clearAudioKeys() {
			this.audioKeys = [];
		},
		setActiveName(name : string) {
			this.activeName = name;
		},
		setIsAudioReady(value : boolean) {
			this.isAudioReady = value
		},
		setLoadedUrls(url : string) {
			this.loadedUrls.push(url)
		},
		setIsLoadedUrl(value : boolean) {
			this.isLoadedUrl = value
		}
	},
	getters: {
		// audios: (state) => state.audios,
		// audioKeys: (state) => state.audioKeys
	},
});