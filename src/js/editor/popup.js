import $ from '../util/dome-core';

/**
 * 弹层控制
 */
export class Popup{
	constructor($toolbar){
		if(!$toolbar) throw new Error('未发现 toolbar 元素，无法添加弹层！');

		this.$toolbar = $($toolbar);
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
		let hasTab = false;
		let $div = $(`<div id="oh-popup-${opts.id}" class="oh-popup-layer oh-popup-${opts.name}"></div>`);

		if(opts.tabs && Array.isArray(opts.tabs)){
			$div.append(this._renderTabs(opts.tabs));
			$div.append(this._renderCont(opts.tabs));
			hasTab = true;
		}else{
			$div.append(this._renderCont(opts.template));
		}

		this.$wrap.append($div);
		hasTab && this._toogleTab($div);

		let related = this.$toolbar.find(`#oh-btn-${opts.id}`);
		let relatedOffset = related.offset();
		let offset = $div.offset();
		let left = relatedOffset.left + (relatedOffset.width / 2) - (offset.width / 2) + 'px';
		let top = relatedOffset.top + (relatedOffset.height + 10) + 'px';

		$div.css({
			left: left,
			top: top
		});
	}

	/**
	 * _renderTabs - 弹层按钮
	 *
	 * @param  {type} tabs description
	 * @return {HTMLElement}      description
	 */
	_renderTabs(tabs){
		let $ul = $('<ul class="clearfix oh-popup-tab"></ul>');

		tabs.forEach((item, index)=>{
			let $li = $('<li></li>');
			let $button = this._renderButton(item);
			index === 0 && $li.addClass('oh-active');
			$li.append($button);
			$ul.append($li);
		});
		return $ul;
	}

	_toogleTab($ele){
		$ele.on('click', '.oh-popup-tab li', function(e){
			console.log(this.index);
		});
	}

	/**
	 * _renderCont - 生成模板
	 *
	 * @param  {string|Array} template description
	 * @return {HTMLElement}          description
	 */
	_renderCont(template){
		let $div = $('<div class="oh-popup-cont"></div>');

		if(Array.isArray(template)){
			template.forEach((item, index)=>{
				let $child = $(`<div class="oh-popup-child oh-popup-child-${item.name}"></div>`);

				index === 0 && $child.addClass('oh-active');
				$child.html(item.template);
				$div.append($child);
			});
		}else{
			$div.html(item.template);
		}
		return $div;
	}

	/**
	 * _renderButton - 生成一个按钮元素
	 *
	 * @return {$button}  description
	 */
	_renderButton(bntOpts){
		let $button = $('<button type="button" class="oh-menu"></button>');
		let $icon = $(`<span class="fa fa-${bntOpts.icon}"></span>`);

		bntOpts.id && $button.attr('id', `oh-${bntOpts.id}`);
		bntOpts.title && $button.attr('title', bntOpts.title);

		/*$button.dataset.for = bntOpts.name;*/

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
		let $div = $('<div class="oh-popup-wrap"></div>');

		this.$toolbar.append($div);
		return $div;
	}
}
