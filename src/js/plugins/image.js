import { Menu } from '../menu/menu';

class Image{
	constructor(_editor_ins){
		this._opts = {
			menu: {
				title: '插入图片',
				icon: 'photo',
				name: 'insert-image' + _editor_ins.id
			}
		};
		this._editor_ins = _editor_ins;
		this._menu_ins = new Menu(_editor_ins.$toolbar);
		this._init();
	}

	_init(){
		this._initMenu();
		this._initImageControl();
	}

	/**
	 * 如果配置了 toolbar.insertImage ，则生成图片按钮
	 * @return {[type]} [description]
	 */
	_initMenu(){
		if(this._editor_ins._opts.toolbar.indexOf('insertImage') !== -1){
			this._menu_ins.addMenu(this._opts.menu);
			this._initCommand();
		}
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