<template>
	<u-popup :show="visible" mode="bottom" @close="onClose">
		<view class="add-wrap">
			<text class="header">添加诗词1</text>
			<view class="add-actions">
				<textarea class="add-textarea" :maxlength="100000" placeholder="请输入" @input="onChange" />
				<u-button type="primary" @click="onSubmit">提交</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, watch } from 'vue';
	import { usePoemStore } from '@/stores'

	interface IProps {
		visible : boolean
		onClose : () => void
		getAddPoemInfo : (value : Object) => void
	}

	const props = defineProps<IProps>()

	const emit = defineEmits(['update:visible'])

	const poemInfo = ref<string>('')
	const autoFocus = ref<boolean>(false)

	const onChange = (e : Event) => {
		poemInfo.value = (e.target as HTMLInputElement).value
	}

	const onSubmit = () => {
		try {
			props?.getAddPoemInfo(JSON.parse(`${poemInfo.value}`))
		} catch (err) {
			console.log(err)
		}
	}
</script>

<style scoped lang="scss">
	.add-wrap {
		display: flex;
		flex-direction: column;
		height: 60vh;
		background-color: #f0efe3;

		.header {
			height: 50px;
			line-height: 50px;
			border-bottom: 1px solid #dbdacb;
			margin-bottom: 10px;
			padding: 0 10px;
		}

		.add-actions {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 10px;

			.add-textarea {
				flex: 1;
				width: 100%;
				text-align: left;
				margin-bottom: 10px;
			}
		}
	}
</style>