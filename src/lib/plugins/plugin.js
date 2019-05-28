/**
 * 插件父类
 */
export default class Plugin{
	constructor(opts, editor){
		this.opts = opts;
		this.editor = editor;
		this.init();
	}

	/**
	 * 插件初始化，包括生成按钮和弹层的操作
	 * @return {[type]} [description]
	 */
	init(){
		this.mountButton();
		this.mountPopup();
	}

	/**
	 * 如果配置了 toolbar.xxx ，且该插件有按钮配置,则生成对应按钮
	 * @return {[type]} [description]
	 */
	mountButton(){
		if(this.editor._opts.toolbar
			&& this.opts.button
			&& $.inArray(this.opts.button.name, this.editor._opts.toolbar) !== -1){
			this.editor.Button.addButton(this.opts.button);
		}
	}

	/**
	 * mountPopup - 初始化各种弹层，如图片上传弹层
	 *
	 * @return {type}  description
	 */
	mountPopup(){
		if(this.editor._opts.toolbar 
			&& this.opts.popup
			&& $.inArray(this.opts.popup.name, this.editor._opts.toolbar) !== -1){
			this.editor.Popup.addPopup(this.opts.popup);
		}
	}
}
