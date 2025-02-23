<script stup lang="ts">
	import {
		usePoemStore
	} from '@/stores'

	export default {
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import 'uview-plus/index.scss';

	body {
		background-color: #d4d2be;
	}
</style>