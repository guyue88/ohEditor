/**
 * 控制栏按钮的操作类
 */
class Button{
	constructor(editor){
		this.editor = editor;
		if(!editor.$toolbar) throw new Error('未发现 toolbar 元素，无法添加按钮！');

		this.$toolbar = editor.$toolbar;
		this.$lastWrap = void 0;
		this._insertWrap();
		this.buttonList = {};
	}

	/**
	 * 添加一个按钮
	 * @param {Object} [opts] [按钮参数，包含title|icon|name|id]
	 * @return {[element]} 按钮元素
	 */
	pushButton(opts){
		if(!opts || !opts.name) return this;
		this.buttonList[opts.name] = opts;
	}

	/**
	 * 添加按钮到控制栏
	 * @param  {string} name [按钮名]
	 * @return {[type]}      [description]
	 */
	render(name){
		name = name.trim();

		if(name === '|'){
			this._split();
			return this;
		}else if(name === '-'){
			this._insertWrap();
			return this;
		}else if(!this.buttonList[name]) {
			return this;
		}

		const $button = this._renderButton(this.buttonList[name]);
		this.$lastWrap.append($button);
		return $button;
	}


	/**
	 * _renderButton - 生成一个按钮元素
	 *
	 * @return {$button}  description
	 */
	_renderButton(bntOpts){
		let $button = document.createElement('button');
		let $icon = document.createElement('span');

		$button.setAttribute('type', 'button');
		$button.setAttribute('id', `oh-btn-${bntOpts.id}`);
		$button.setAttribute('title', bntOpts.title);
		$button.classList.add(`oh-menu`);
		$icon.classList.add('fa');
		$icon.classList.add(`fa-${bntOpts.icon}`);

		if(bntOpts.type === 'drop'){
			$button.classList.add('oh-drop');
		}else if(bntOpts.type === 'popup'){
			$button.classList.add('oh-popup');
			$button.dataset.popup = `oh-popup-${bntOpts.id}`;
		}else{
			$button.classList.add('oh-cmd-btn');
		}

		$button.append($icon);
		return $button;
	}

	/**
	 * 内置，换行
	 * @return {element}      最后面的容器
	 */
	_insertWrap(){
		let $div = document.createElement('div');
		$div.classList.add('oh-button-wrap');
		$div.classList.add('clearfix');

		this.$toolbar.append($div);
		this.$lastWrap = $div;
		return $div;
	}

	/**
	 * 内置，分隔符
	 * @return {[type]}      [description]
	 */
	_split(){
		let $span = document.createElement('span');
		$span.classList.add('oh-split');
		this.$lastWrap.append($span);
		return $span;
	}
}

export { Button };
