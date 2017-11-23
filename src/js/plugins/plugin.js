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
	}

	/**
	 * 如果配置了 toolbar.xxx ，则生成对应按钮
	 * @return {[type]} [description]
	 */
	initButton(){
		if(this.ins_editor._opts.toolbar
			&& this.ins_editor._opts.toolbar.indexOf(this.opts.button.name) !== -1){
			this.ins_editor.button.pushButton(this.opts.button);
		}
	}
}

export { Plugin };