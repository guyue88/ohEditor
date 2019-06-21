import Plugin from './Plugin';
import $ from '../util/dom-core';

export default class Image extends Plugin{
	constructor(editor){
		const id = 'insert-image-' + editor.id;
		const name = 'insertImage';
		const _opts = {
			button: {
				id,
				name,
				title: '插入图片',
				icon: 'photo',
				type: 'popup',
			},
			popup: {
				id,
				name,
				type: 'popup',
				tabs: [{
					name: 'upload',
					icon: 'upload',
					title: '上传图片',
					template: `<strong>选择图片</strong>
						<div class="oh-form">
							<input type="file" accept="image/jpeg, image/jpg, image/png, image/gif, image/svg+xml" tabindex="-1" class="oh-upload-image">
						</div>
					`
				}, {
					name: 'link',
					icon: 'link',
					title: '插入图片链接',
					template: `<div class="oh-insert-input">
						<input type="url" tabindex="-1" class="oh-image-link" placeholder="https://"/>
					</div>
					<div class="oh-insert-image">
						<button type="button" class="oh-insert-button">插入</button>
					</div>`
				}]
			}
		};
		super(_opts, editor);
		this.name = name;
		this.config = {
			useBase64: true,
			maxBase64Size: 20000,
			uploadKey: 'image',
			...(this._editor._opts[name] || {})
		};
		this._initCommand();
	}

	/**
	 * 如果配置了 toolbar.insertImage ，则可以插入图片
	 * @return {[type]} [description]
	 */
	_initCommand(){
		this._editor.ready(() => {
			const $layer = this._editor.Popup.getPopupLayer(this.name),
				$image = $layer.find('.oh-upload-image'),
				$imageInsertButton = $layer.find('.oh-insert-button'),
				$imageInsertInput = $layer.find('.oh-image-link');

			const { config } = this;
			$image.on('change', () => {
				const file = $image.get(0).files[0];
				const { size } = file;
				
				if (config.useBase64 && size <= config.maxBase64Size) {
					this._loadWithBase64(file, $layer);
				} else if (config.target) {
					this._uploadImage(file, $layer);
				} else {
					throw new Error('无法处理该图片，请设置图片上传路径~~');
				}
			});
			// const range = this._editor.Selection.getRange();
			$imageInsertButton.on('click', () => {
				const link = $imageInsertInput.val();
				$layer.hide();
				//TODO 编辑区失去焦点会使得选区丢失从而无法插入图片，待修复
				// this._editor.Selection.restoreRange(range);
				this._editor.Cmd.do('insertHTML', `<img src='${link}' width='100%' />`);
			});
		});
	}

	_loadWithBase64(file, $layer) {
		const reader = new FileReader();
		const { name } = file;
		$(reader).once('load', () => {
			$layer.hide();
			this._editor.Cmd.do('insertHTML', `<img src='${reader.result}' width='100%' title='${name}' alt='${name}' />`);
		});

		reader.readAsDataURL(file);
	}

	_uploadImage(file, $layer) {
		const { config } = this;
		const { uploadKey = 'image', target } = config;
		const { name } = file;
		const fd = new FormData();
		fd.append(uploadKey, file);
		$.ajax({
			url: target,
			data: fd,
			processData: false,
			contentType: false,
		}).then(res => {
			const path = res.path || res;
			$layer.hide();
			this._editor.Cmd.do('insertHTML', `<img src='${path}' width='100%' title='${name}' alt='${name}' />`);
		}, () => {
			console.warn('上传错误');
		});
	}

	/**
	 * 图片控制器，用于调整编辑区域的图片样式
	 * @return {[type]} [description]
	 */
	_initImageControl(){

	}
}

