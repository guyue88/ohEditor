/**
 * 所有弹层控制
 */
import $ from '../util/dom-core';

export class Popup{
	constructor(editor){
		this._editor = editor;
		if(!editor.$toolbar) throw new Error('未发现 toolbar 元素，无法添加弹层！');

		this.$wrap = this._insertWrap();
		this.popupList = [];
	}

	/**
	 * pushPopup - 挂载弹层，统一渲染
	 *
	 * @param  {Object} opts 配置
	 * @return {Popup}      实例
	 */
	pushPopup(opts){
		if(!opts || !opts.name) return this;
		this.popupList.push(opts);
		return this;
	}

	/**
	 * render - 渲染弹层，弹层是插件里面定义的，直接将所有定义的插件渲染出来
	 *
	 * @return {Popup}  实例
	 */
	render(){
		this.popupList.forEach(item=>{
			const type = item.type || 'popup';
			switch (type.trim()) {
				case 'drop':
					this._renderDrop(item);
					break;
				case 'popup':
					this._renderPopup(item);
					break;
			}
		});
		/*添加弹层显示与关闭的事件*/
		this._toggleLayer();
		/*添加操作弹层tab切换的事件*/
		this._toggleLayerTab();
		return this;
	}

	/**
	 * _renderDrop - 渲染一个下拉列表
	 *
	 * @param  {type} opts description
	 * @return {type}  description
	 */
	_renderDrop(opts){
		let $div = $(`<div id="oh-drop-${opts.id}" class="oh-layer oh-drop-layer oh-drop-${opts.name}"></div>`);
		let $list = this._renderList(opts.dropList, opts.cmd);

		$div.append($list);
		this.$wrap.append($div);

		let $related = this._editor.$toolbar.find(`#oh-btn-${opts.id}`);
		let relatedOffset = $related.offset();
		let left = relatedOffset.left + 'px';
		let top = relatedOffset.top + relatedOffset.height + 'px';

		$div.css({
			left: left,
			top: top,
			display: "none",
			visibility: "visible"
		});
		return this;
	}

	/**
	 * _renderList - 渲染下拉列表内容
	 *
	 * @param  {array} list description
	 * @param  {string} cmd 命令
	 * @return {VE}      description
	 */
	_renderList(list, cmd){
		let $ul = $('<ul class="oh-drop-list"></ul>');
		list.forEach(item=>{
			let $li = $(`<li>
				<a href="javascript:;" data-cmd="${cmd}" data-param="${item.param}" title="${item.title||item.text}">
					${item.html||item.text}
				</a>
			</li>`);
			$ul.append($li);
		});
		return $ul;
	}

	/**
	 * _renderPopup - 渲染一个操作弹层
	 *
	 * @param  {type} opts description
	 * @return {Popup}      description
	 */
	_renderPopup(opts){
		let $div = $(`<div id="oh-popup-${opts.id}" class="oh-layer oh-popup-layer oh-popup-${opts.name}"></div>`);

		if(opts.tabs && Array.isArray(opts.tabs)){
			$div.append(this._renderLayerTabs(opts.tabs));
			$div.append(this._renderLayerCont(opts.tabs));
		}else{
			$div.append(this._renderLayerCont(opts.template));
		}

		this.$wrap.append($div);

		let $related = this._editor.$toolbar.find(`#oh-btn-${opts.id}`);
		let relatedOffset = $related.offset();
		let offset = $div.offset();
		let left = relatedOffset.left + (relatedOffset.width / 2) - (offset.width / 2) + 'px';
		let top = relatedOffset.top + (relatedOffset.height + 10) + 'px';

		$div.css({
			left: left,
			top: top,
			display: "none",
			visibility: "visible"
		});
		return this;
	}

	/**
	 * _renderLayerTabs - 生成操作弹层按钮
	 *
	 * @param  {type} tabs description
	 * @return {VN}      description
	 */
	_renderLayerTabs(tabs){
		let $ul = $('<ul class="clearfix oh-popup-tab"></ul>');

		tabs.forEach((item, index)=>{
			let $li = $('<li></li>');
			let $button = this._renderLayerButton(item);
			index === 0 && $li.addClass('oh-active');
			$li.append($button);
			$ul.append($li);
		});
		return $ul;
	}

	/**
	 * _renderLayerCont - 生成操作弹层的内容
	 *
	 * @param  {string|Array} template description
	 * @return {VE}          description
	 */
	_renderLayerCont(template){
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
	 * _renderLayerButton - 生成一个操作弹层内的按钮元素
	 *
	 * @return {$button}  description
	 */
	_renderLayerButton(bntOpts){
		let $button = $('<button type="button" class="oh-menu"></button>');
		let $icon = $(`<span class="fa fa-${bntOpts.icon}"></span>`);

		bntOpts.id && $button.attr('id', `oh-${bntOpts.id}`);
		bntOpts.title && $button.attr('title', bntOpts.title);

		$button.append($icon);
		return $button;
	}

	/**
	 * _insertWrap - 插入弹层父容器
	 *
	 * @return {VE}  element
	 */
	_insertWrap(){
		let $div = $('<div class="oh-popup-wrap"></div>');

		this._editor.$toolbar.append($div);
		return $div;
	}

	/**
	 * _toggleLayerTab - 操作弹层内的tab切换
	 *
	 * @return {type}      description
	 */
	_toggleLayerTab(){
		const $layer = this._editor.$toolbar.find('.oh-popup-layer');
		$layer.on('click', '.oh-popup-tab li', function(e){
			let me = $(this),
				index = me.index(),
				$pop = me.parents('.oh-popup-layer').find('.oh-popup-child');

			me.addClass('oh-active').siblings().removeClass('oh-active');
			$pop.eq(index).addClass('oh-active').siblings().removeClass('oh-active');
			return false;
		});
		/*点击弹层，弹层不消失*/
		$layer.on('click', function(e){
			e.stopPropagation();
			e.cancelBubble = true;
		});
	}

	/**
	 * _toggleLayer - 弹层的关闭与显示控制
	 *
	 * @return {type}      description
	 */
	_toggleLayer($btn){
		const self = this;
		const $layer = this._editor.$toolbar.find('.oh-layer');

		this._editor.$toolbar.on('click', '.oh-drop,.oh-popup', function(){
			const me = $(this),
				$popup = self._editor.$toolbar.find(`#${me.data('popup')}`);

			$popup.siblings().hide();
			$popup.show();
			return false;
		});

		/*点击其他地方关闭弹层*/
		$(document).on('click', function(){
			$layer.hide();
		});
	}
}
