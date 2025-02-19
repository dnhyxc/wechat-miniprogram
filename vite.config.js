import {
	defineConfig
} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
	plugins: [uni()],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
          @use "sass:math";
          @import "uview-plus/theme.scss";
        `
			}
		}
	}
})