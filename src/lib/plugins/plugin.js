/**
 * 插件父类
 */
export default class Plugin{
	constructor(opts, editor){
		this._opts = opts;
		this._editor = editor;
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
		if(this._editor._opts.toolbar
			&& this._opts.button
			&& $.inArray(this._opts.button.name, this._editor._opts.toolbar) !== -1){
			this._editor.Button.addButton(this._opts.button);
		}
	}

	/**
	 * mountPopup - 初始化各种弹层，如图片上传弹层
	 *
	 * @return {type}  description
	 */
	mountPopup(){
		if(this._editor._opts.toolbar 
			&& this._opts.popup
			&& $.inArray(this._opts.popup.name, this._editor._opts.toolbar) !== -1){
			this._editor.Popup.addPopup(this._opts.popup);
		}
	}
}
