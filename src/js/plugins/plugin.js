/**
 * 插件父类
 */
class Plugin{
	constructor(opts, editor){
		this.opts = opts;
		this.ins_editor = editor;
		this.init();
	}

	/**
	 * 插件初始化，包括生成按钮和弹层的操作
	 * @return {[type]} [description]
	 */
	init(){
		this.initButton();
		this.initPopup();
	}

	/**
	 * 如果配置了 toolbar.xxx ，且该插件有按钮配置,则生成对应按钮
	 * @return {[type]} [description]
	 */
	initButton(){
		if(this.ins_editor._opts.toolbar
			&& this.opts.button
			&& this.ins_editor._opts.toolbar.indexOf(this.opts.button.name) !== -1){
			this.ins_editor.button.pushButton(this.opts.button);
		}
	}


	/**
	 * initPopup - 初始化各种弹层，如图片上传弹层
	 *
	 * @return {type}  description
	 */
	initPopup(){
		if(this.opts.popup && this.ins_editor.popup){
			this.ins_editor.popup.pushPopup(this.opts.popup);
		}
	}
}

export { Plugin };
