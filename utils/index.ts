import { toRaw } from 'vue'
import { usePoemStore } from '@/stores';

const poemStore = usePoemStore()

const audio = wx.createInnerAudioContext(); // 创建音频上下文

export const playAudio = (url : string, name ?: string) => {
	if (toRaw(poemStore.currentAudio)) {
		toRaw(poemStore.currentAudio)!.currentTime = 0
		toRaw(poemStore.currentAudio)?.pause()
	}
	poemStore.setActiveName(name || '')
	audio.src = url;
	poemStore.setCurrentAudio(null)
	poemStore.clearAudioKeys()

	// 监听音频加载完成事件
	if (poemStore.loadedUrls.includes(url)) {
		audio.play();
		poemStore.setCurrentAudio(audio)
	} else {
		audio.onCanplay(() => {
			poemStore.setIsAudioReady(true)
			poemStore.setLoadedUrls(url)
			if (poemStore.isAudioReady && audio.paused) {
				audio.play();
				poemStore.setCurrentAudio(audio)
			}
		});
	}

	audio.onPause(() => {
		poemStore.setIsAudioReady(false)
	})
	// 监听音频加载错误事件
	audio.onError(() => {
		poemStore.setCurrentAudio(null)
	});
};

export const stopAudio = (name ?: string) => {
	if (toRaw(poemStore.currentAudio)) {
		toRaw(poemStore.currentAudio)!.currentTime = 0
		toRaw(poemStore.currentAudio)?.pause()
	}
	poemStore.setCurrentAudio(null)
	poemStore.clearAudioKeys()
	poemStore.setActiveName(name || '')
};

export const onActiveDescAudio = (url : string, key : string) => {
	if (toRaw(poemStore.currentAudio)) {
		toRaw(poemStore.currentAudio)!.currentTime = 0
		toRaw(poemStore.currentAudio)?.pause()
	}
	poemStore.setActiveName('')
	poemStore.setCurrentAudio(null)

	if (!(poemStore.audioKeys as string[]).includes(key)) {
		audio.src = url;
		poemStore.setAudioKeys(key)
		// 监听音频加载完成事件
		if (poemStore.loadedUrls.includes(url)) {
			audio.play()
			poemStore.setCurrentAudio(audio)
		} else {
			audio.onCanplay(() => {
				poemStore.setIsAudioReady(true)
				poemStore.setLoadedUrls(url)
				if (poemStore.isAudioReady && audio.paused) {
					audio.play();
					poemStore.setCurrentAudio(audio)
				}
			});
		}
		audio.onPause(() => {
			poemStore.setIsAudioReady(false)
		})
		// 监听音频加载错误事件
		audio.onError(() => {
			// poemStore.clearAudios()
			poemStore.setCurrentAudio(null)
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