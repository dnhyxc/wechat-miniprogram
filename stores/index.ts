import { defineStore } from 'pinia';

interface IProps {
	currentAudio : WechatMiniprogram.InnerAudioContext | null
	audios : WechatMiniprogram.InnerAudioContext[]
	audioKeys : string[],
	activeName : string,
	isAudioReady : boolean,
	loadedUrls : string[],
}

export const usePoemStore = defineStore('poem', {
	state: () : IProps => ({
		currentAudio: null,
		audios: [],
		audioKeys: [],
		activeName: '',
		isAudioReady: false,
		loadedUrls: [],
	}),
	actions: {
		setCurrentAudio(audio : WechatMiniprogram.InnerAudioContext | null) {
			this.currentAudio = audio
		},
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
	},
	getters: {
		// audios: (state) => state.audios,
		// audioKeys: (state) => state.audioKeys
	},
});