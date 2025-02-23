export const request = <T>({
	method = 'POST',
	url,
	data,
	callback
} : {
	method ?: "POST" | "GET",
	url : string,
	data ?: Object,
	callback ?: (data : T) => void
}) : Promise<T> => {
	try {
		return new Promise((resolve, reject) => {
			wx.request({
				url,
				method,
				data,
				success: (res) => {
					// 将 res.data 显式断言为 T 类型
					resolve(res.data as T); // 这里假设响应数据的类型是 T
					callback && callback(res.data as T); // 调用回调时也进行类型断言
				},
				fail: (error) => {
					reject(error);
					callback && callback(error as any); // 这里可以根据实际情况处理错误
				},
				complete: () => { }
			});
		});
	} catch (error) {
		return Promise.reject(error);
	}
}