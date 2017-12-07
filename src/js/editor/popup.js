import $ from '../util/dome-core';

/**
 * 弹层控制
 */
export class Popup{
	constructor($toolbar){
		if(!$toolbar) throw new Error('未发现 toolbar 元素，无法添加弹层！');

		this.$toolbar = $toolbar;
		this.$wrap = this._insertWrap();
		this.popupList = [];
	}

	/**
	 * render - 渲染搜索弹层
	 *
	 * @return {type}  description
	 */
	render(){
		this.popupList.forEach(item=>{
			this._renderItem(item);
		});
		return this;
	}

	/**
	 * _renderItem - 渲染一个弹层
	 *
	 * @param  {type} opts description
	 * @return {Popup}      description
	 */
	_renderItem(opts){
		let $div = document.createElement('div');
		$div.setAttribute('id', `oh-popup-${opts.id}`);
		$div.classList.add('oh-popup-layer');
		$div.classList.add(`oh-popup-${opts.name}`);

		if(opts.tabs && Array.isArray(opts.tabs)){
			$div.append(this._renderTabs(opts.tabs));
			$div.append(this._renderCont(opts.tabs));
			this._toogleTab($div);
		}else{
			$div.append(this._renderCont(opts.template));
		}

		this.$wrap.append($div);
		console.log( $(`#oh-btn-${opts.id}`, $(this.$toolbar)).css('display') );
		let related = this.$toolbar.querySelector(`#oh-btn-${opts.id}`);
		let left = related.offsetLeft + (related.offsetWidth / 2) - ($div.offsetWidth / 2) + 'px';
		let top = related.offsetTop + (related.offsetHeight + 10) + 'px';

		$div.style.left = left;
		$div.style.top = top;
	}

	/**
	 * _renderTabs - 弹层按钮
	 *
	 * @param  {type} tabs description
	 * @return {HTMLElement}      description
	 */
	_renderTabs(tabs){
		let $ul = document.createElement('ul');
		$ul.classList.add('clearfix');
		$ul.classList.add('oh-popup-tab');
		tabs.forEach((item, index)=>{
			let $li = document.createElement('li');
			let $button = this._renderButton(item);
			index === 0 && $li.classList.add('oh-active');
			$li.append($button);
			$ul.append($li);
		});
		return $ul;
	}

	_toogleTab($wrap){
		$wrap.add
	}

	/**
	 * _renderCont - 生成模板
	 *
	 * @param  {string|Array} template description
	 * @return {HTMLElement}          description
	 */
	_renderCont(template){
		let $div = document.createElement('div');
		$div.classList.add('oh-popup-cont');

		if(Array.isArray(template)){
			template.forEach((item, index)=>{
				let $child = document.createElement('div');
				$child.classList.add('oh-popup-child');
				$child.classList.add(`oh-popup-child-${item.name}`);
				index === 0 && $child.classList.add('oh-active');
				$child.innerHTML = item.template;
				$div.append($child);
			});
		}else{
			$div.innerHTML = template;
		}
		return $div;
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
		bntOpts.id && $button.setAttribute('id', `oh-${bntOpts.id}`);
		$button.setAttribute('title', bntOpts.title);
		$button.classList.add(`oh-menu`);
		$button.dataset.for = bntOpts.name;
		$icon.classList.add('fa');
		$icon.classList.add(`fa-${bntOpts.icon}`);

		$button.append($icon);
		return $button;
	}

	/**
	 * pushPopup - 将弹层配置爱插入队列
	 *
	 * @param  {Object} opts 配置
	 * @return {Popup}      实例
	 */
	pushPopup(opts){
		if(!opts || !opts.name) return this;
		this.popupList.push(opts);
	}

	_insertWrap(){
		let $div = document.createElement('div');
		$div.classList.add('oh-popup-wrap');

		this.$toolbar.append($div);
		return $div;
	}
}
