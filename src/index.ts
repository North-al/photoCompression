import prompts from 'prompts'
import images from 'images'

images.setLimit(1024 * 1024 * 100, 1024 * 1024 * 100)
images.setGCThreshold(1024 * 1024 * 100)

const getImagePath = async () => {
	const { image_path } = (await prompts({
		type: 'text',
		name: 'image_path',
		message: '请输入图片路径 直接将图片拖拽进入即可\n图片超过4MB可能会出错'
	})) as { image_path: string }

	const path = image_path.replace(/"/g, '').replace(/\\/g, '/')
	if (!/.*\.(jpg|png|jpeg|gif)$/.test(path)) {
		throw new Error('图片格式不正确, 请重新输入')
	}

	return path
}
const parseFile = async () => {
	try {
		const path = await getImagePath()
		const name = path.split('/').pop() as string

		const image = images(path)
		const size = image.size()
		console.log('当前图片大小', size)

		const { zoom } = await prompts({
			type: 'number',
			name: 'zoom',
			message: '请输入缩放比例(%)'
		})

		image
			.size((size.width * zoom) / 100, (size.height * zoom) / 100)
			.save(`${new Date().getTime()}-${name}`, {
				quality: 100
			})
	} catch (error: any) {
		console.error(error.message)
	}
}

parseFile()
