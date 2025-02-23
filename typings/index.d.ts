/// <reference path="./types/index.d.ts" />

interface IAppOption {
	globalData : {
		userInfo ?: WechatMiniprogram.UserInfo,
	}
	userInfoReadyCallback ?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

export interface PoemInfo {
	name : string,
	poem : string[],
	translation : string[],
	desc : string,
	link : string,
	audio : string,
	descAudio : string
}