import { toRaw } from 'vue'
import { usePoemStore } from '@/stores';

const poemStore = usePoemStore()

const audio = wx.createInnerAudioContext(); // 创建音频上下文

export const playAudio = (url : string, name ?: string) => {
	poemStore.setIsLoadedUrl(true)
	if (poemStore.audios?.length) {
		toRaw(poemStore.audios).forEach((i : any) => {
			i.currentTime = 0;
			i.pause()
		})
		poemStore.clearAudios()
		poemStore.clearAudioKeys()
	}
	poemStore.setActiveName(name || '')
	audio.src = url;
	// 监听音频加载完成事件
	if (poemStore.loadedUrls.includes(url)) {
		audio.play();
		poemStore.setAudios(audio);
		poemStore.setIsLoadedUrl(false)
	} else {
		audio.onCanplay(() => {
			poemStore.setIsLoadedUrl(false)
			poemStore.setIsAudioReady(true)
			poemStore.setLoadedUrls(url)
			if (poemStore.isAudioReady && audio.paused) {
				audio.play();
				poemStore.setAudios(audio);
			}
		});
	}
	audio.onPause(() => {
		poemStore.setIsAudioReady(false)
	})
	// 监听音频加载错误事件
	audio.onError(() => {
		poemStore.clearAudios()
	});
};

export const stopAudio = (name ?: string) => {
	if (poemStore.audios?.length) {
		toRaw(poemStore.audios).forEach((i : any) => {
			i.currentTime = 0;
			i.pause()
		})
		poemStore.clearAudios()
		poemStore.clearAudioKeys()
		poemStore.setActiveName(name || '')
	}
};

export const onActiveDescAudio = (url : string, key : string) => {
	if (poemStore.audios?.length) {
		toRaw(poemStore.audios).forEach((i : any) => {
			i.currentTime = 0;
			i.pause()
		})
		poemStore.clearAudios()
		poemStore.setActiveName('')
	}
	if (!(poemStore.audioKeys as string[]).includes(key)) {
		poemStore.setIsLoadedUrl(true)
		audio.src = url;
		poemStore.setAudioKeys(key)
		// 监听音频加载完成事件
		if (poemStore.loadedUrls.includes(url)) {
			poemStore.setIsLoadedUrl(false)
			audio.play();
			poemStore.setAudios(audio);
		} else {
			audio.onCanplay(() => {
				poemStore.setIsLoadedUrl(false)
				poemStore.setIsAudioReady(true)
				poemStore.setLoadedUrls(url)
				if (poemStore.isAudioReady && audio.paused) {
					audio.play();
					poemStore.setAudios(audio);
				}
			});
		}
		audio.onPause(() => {
			poemStore.setIsAudioReady(false)
		})
		// 监听音频加载错误事件
		audio.onError(() => {
			poemStore.clearAudios()
			const keys = poemStore.audioKeys.filter(i => i !== key)
			poemStore.setAudioKeys(keys)
		});
		// 监听音频播放完成
		audio.onEnded(() => {
			const keys = poemStore.audioKeys.filter(i => i !== key)
			poemStore.setAudioKeys(keys)
		});
	} else {
		const keys = poemStore.audioKeys.filter(i => i !== key)
		poemStore.setAudioKeys(keys)
	}
}