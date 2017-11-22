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
		this._menu_ins.addMenu(this._opts.menu);
	}
}

export { Image }