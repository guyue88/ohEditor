import Plugin from './Plugin';

export default class Image extends Plugin{
	constructor(editor){
		const id = 'insert-image-' + editor.id;
		const name = 'insertImage';
		const _opts = {
			button: {
				title: '插入图片',
				icon: 'photo',
				name: name,
				type: 'popup',
				id: id
			},
			popup: {
				id: id,
				name: name,
				type: 'popup',
				tabs: [{
					name: 'upload',
					icon: 'upload',
					title: '上传图片',
					template: `<strong>选择图片</strong>
						<div class="oh-form">
							<input type="file" accept="image/jpeg, image/jpg, image/png, image/gif, image/svg+xml" tabindex="-1">
						</div>
					`
				},{
					name: 'link',
					icon: 'link',
					title: '插入图片链接',
					template: `<div>插入链接</div>`
				}]
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

