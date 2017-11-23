import { Plugin } from './Plugin';

class Image extends Plugin{
	constructor(editor){
		const _opts = {
			button: {
				title: '插入图片',
				icon: 'photo',
				name: 'insertImage',
				id: 'insert-image-' + editor.id
			}
		};
		super(_opts, editor);
	}

	/**
	 * 如果配置了 toolbar.insertImage ，则可以插入图片
	 * @return {[type]} [description]
	 */
	_initCommand(){

	}

	/**
	 * 图片控制器，用于调整编辑区域的图片样式
	 * @return {[type]} [description]
	 */
	_initImageControl(){

	}
}

export { Image }