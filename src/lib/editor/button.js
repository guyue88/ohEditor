import $ from '../util/dom-core';

/**
 * 控制栏按钮的操作类
 */
class Button{
	constructor(editor){
		this._editor = editor;
		if(!editor.$toolbar) throw new Error('未发现 toolbar 元素，无法添加按钮！');

		this.$lastWrap = this._insertWrap();
		this.list = {};
	}

	/**
	 * pushButton - 挂载按钮，按照配置顺序统一渲染
	 * @param {Object} opts 按钮参数，包含title|icon|name|id
	 * @return {type}  description
	 */
	pushButton(opts){
		if(!opts || !opts.name) return this;
		this.list[opts.name.trim()] = opts;
		return this;
	}

	/**
	 * 渲染单个按钮到控制栏
	 * @param  {string} name [按钮名]
	 * @return {VE}      按钮VE实例
	 */
	render(name){
		name = name.trim();

		if(name === '|'){
			this._split();
			return this;
		}else if(name === '-'){
			this.$lastWrap = this._insertWrap();
			return this;
		}else if(!this.list[name]) {
			return this;
		}

		const $button = this._renderButton(this.list[name]);
		this.$lastWrap.append($button);
		return $button;
	}

	/**
	 * _renderButton - 生成一个按钮元素
	 *
	 * @return {$button}  description
	 */
	_renderButton(btnOpts){
		let $button = $(`
			<button type="button" id="oh-btn-${btnOpts.id}" title="${btnOpts.title}" class="oh-menu">
				<span class="fa fa-${btnOpts.icon}"></span>
			</button>
		`);

		if(btnOpts.type === 'drop'){
			$button.addClass('oh-drop');
			$button.data('popup', `oh-drop-${btnOpts.id}`);
		}else if(btnOpts.type === 'popup'){
			$button.addClass('oh-popup');
			$button.data('popup', `oh-popup-${btnOpts.id}`);
		}else{
			/*普通命令按钮直接绑定命令操作*/
			$button.addClass('oh-cmd-btn');
			$button.data('cmd', btnOpts.cmd);
			btnOpts.cmdParam && $button.data('param', btnOpts.cmdParam);
		}

		return $button;
	}

	/**
	 * 内置，插入新容器以换行
	 * @return {element}      最后面的容器
	 */
	_insertWrap(){
		let $div = $('<div class="clearfix oh-button-wrap"></div>');

		this._editor.$toolbar.append($div);
		return $div;
	}

	/**
	 * 内置，分隔符
	 * @return {Button}      实例
	 */
	_split(){
		let $span = $('<span class="oh-split"></span>');
		this.$lastWrap.append($span);
		return $span;
	}
}

export { Button };
