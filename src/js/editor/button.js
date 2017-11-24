/**
 * 控制栏按钮的操作类
 */
class Button{
	constructor($toolbar){
		if(!$toolbar) throw new Error('未发现 toolbar 元素，无法添加按钮！');

		this.$toolbar = $toolbar;
		this.$lastWrap = void 0;
		this.insertWrap();
		this.buttonList = {};
	}

	/**
	 * 添加一个按钮
	 * @param {[Object]} [opts] [按钮参数，包含title|icon|name|id]
	 * @return {[element]} 按钮元素
	 */
	pushButton(opts){
		if(!opts || !opts.name) return this;
		this.buttonList[opts.name] = opts;
	}

	/**
	 * 添加按钮到控制栏
	 * @param  {[string]} name [按钮名]
	 * @return {[type]}      [description]
	 */
	render(name){
		name = name.trim();

		if(name === '|'){
			this.split();
			return this;
		}else if(name === '-'){
			this.insertWrap();
			return this;
		}else if(!this.buttonList[name]) {
			return this;
		}

		const button = this.buttonList[name];
		let $button = document.createElement('button');
		let $icon = document.createElement('span');

		$button.setAttribute('type', 'button');
		$button.setAttribute('id', `oh-${button.id}`);
		$button.setAttribute('class', `oh-menu`);
		$button.setAttribute('title', button.title);
		$icon.setAttribute('class', `fa fa-${button.icon}`);

		if(button.type === 'drop'){
			$button.classList.add('oh-drop');
		}else if(button.type === 'popup'){
			$button.classList.add('oh-popup');
			$button.dataset.popupFor = `oh-oppup-${name}`;
		}

		$button.append($icon);
		this.$lastWrap.append($button);
		return $button;
	}

	/**
	 * 内置，换行
	 * @return {element}      最后面的容器
	 */
	insertWrap(){
		let $div = document.createElement('div');
		$div.classList.add('oh-wrap');
		$div.classList.add('clearfix');
		
		this.$toolbar.append($div);
		this.$lastWrap = $div;
		return $div;
	}

	/**
	 * 内置，分隔符
	 * @return {[type]}      [description]
	 */
	split(){
		let $span = document.createElement('span');
		$span.classList.add('oh-split');
		this.$lastWrap.append($span);
		return $span;
	} 
}

export { Button };