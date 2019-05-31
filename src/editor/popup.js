/**
 * 所有弹层控制
 */
import $ from '../util/dom-core';

export class Popup{
	constructor(editor){
		this._editor = editor;
		this._popupList = [];
		this._$wrap = void 0;
	}

	/**
	 * addPopup - 挂载弹层，统一渲染
	 *
	 * @param  {{
	 * 	id: string|number,
	 * 	name: string,
	 * 	type?: 'popup' | 'drop',
	 * 	cmd?: string,
	 * 	dropList: [{
	 * 		html: string,
	 * 		text: string,
	 * 		title?: string,
	 * 		cmd?: string,
	 *		param?: string,
	 * 	}],
	 * 	tabs: [{
	 * 		name: string,
	 *		icon: string,
	 *		title: string,
	 *		template: string,
	 * 	}],
	 * 	template?: string,
	 * }} opts 配置
	 * @return {Popup}      实例
	 */
	addPopup(opts){
		if(!opts || !opts.name) return this;
		this._popupList.push(opts);
		return this;
	}

	/**
	 * render - 渲染弹层，弹层是插件里面定义的，直接将所有定义的插件渲染出来
	 *
	 * @return {Popup}  实例
	 */
	render(){
		if(!this._editor.$toolbar) throw new Error('未发现 toolbar 元素，无法添加弹层！');
		this._$wrap = this._insertWrap();

		this._popupList.forEach(item=>{
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
		this._addToggleLayerEvent();
		/*添加操作弹层tab切换的事件*/
		this._addToggleTabEvent();
		return this;
	}

	/**
	 * 获取某个插件对应的弹层
	 *
	 * @param {string} name
	 * @returns
	 */
	getPopupLayer(name) {
		return this._$wrap.find(`.oh-popup-${name.trim()}`);
	}

	/**
	 * 获取某个插件对应的下拉弹层
	 *
	 * @param {string} name
	 * @returns
	 */
	getDropLayer(name) {
		return this._$wrap.find(`.oh-drop-${name.trim()}`);
	}

	/**
	 * 渲染一个下拉列表
	 *
	 * @private
	 * @param  {type} opts description
	 * @return {Popup}  实例
	 */
	_renderDrop(opts){
		const list = this._renderList(opts.dropList, opts.cmd);
		const $div = $(`<div id="oh-drop-${opts.id}" class="oh-layer oh-drop-layer oh-drop-${opts.name}">${list}</div>`);

		this._$wrap.append($div);

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
	 * @private
	 * @param  {array} list description
	 * @param  {string} cmd 命令
	 * @return {string} DOM string
	 */
	_renderList(list, cmd) {
		const li = list.map(item=>{
			return `<li>
				<a href="javascript:;" data-cmd="${item.cmd || cmd}" data-param="${item.param}" title="${item.title||item.text}">
					${item.html||item.text}
				</a>
			</li>`;
		});
		return `<ul class="oh-drop-list">${li.join('')}</ul>`;
	}

	/**
	 * _renderPopup - 渲染一个操作弹层
	 *
	 * @private
	 * @param  {type} opts description
	 * @return {Popup} 实例
	 */
	_renderPopup(opts) {
		const children = [];
		if(opts.tabs && Array.isArray(opts.tabs)) {
			children.push(this._renderLayerTabs(opts.tabs));
			children.push(this._renderLayerCont(opts.tabs));
		} else {
			children.push(this._renderLayerCont(opts.template));
		}
		const $div = $(`<div id="oh-popup-${opts.id}" class="oh-layer oh-popup-layer oh-popup-${opts.name}">${children.join('')}</div>`)
		this._$wrap.append($div);

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
	 * @private
	 * @param  {type} tabs description
	 * @return {string} DOM string
	 */
	_renderLayerTabs(tabs){
		const li = tabs.map((item, index)=>{
			const button = this._renderLayerButton(item);
			return `<li${index === 0 ? ' class="oh-active"' : ''}>${button}</li>`;
		});
		return `<ul class="clearfix oh-popup-tab">${li.join('')}</ul>`;
	}

	/**
	 * _renderLayerCont - 生成操作弹层的内容
	 *
	 * @private
	 * @param  {string|Array} template description
	 * @return {string} DOM string
	 */
	_renderLayerCont(template){
		let tpls = [];
		if(Array.isArray(template)){
			tpls = template.map((item, index)=>{
				return `<div class="oh-popup-child oh-popup-child-${item.name}${index === 0 ? ' oh-active' : ''}">${item.template}</div>`
			});
		}else{
			tpls.push(item.template);
		}
		return `<div class="oh-popup-cont">${tpls.join('')}</div>`;
	}

	/**
	 * 生成一个操作弹层内的按钮元素
	 *
	 * @private
	 * @return {string}  DOM string
	 */
	_renderLayerButton(bntOpts){
		const icon = `<span class="fa fa-${bntOpts.icon}"></span>`;
		const button = `<button
				type="button"
				class="oh-menu"
				${bntOpts.id ? ' id=oh-' + bntOpts.id : ''}
				${bntOpts.title ? ' title=' + bntOpts.title : ''}
			>${icon}</button>`;
		return button;
	}

	/**
	 * _insertWrap - 插入弹层父容器
	 *
	 * @private
	 * @return {VE}  element
	 */
	_insertWrap(){
		let $div = $('<div class="oh-popup-wrap"></div>');

		this._editor.$toolbar.append($div);
		return $div;
	}

	/**
	 * 操作弹层内的tab切换
	 *
	 * @private
	 * @return {type}      description
	 */
	_addToggleTabEvent(){
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
	 * 点击菜单按钮显示弹层，点击其他地方关闭弹层
	 *
	 * @private
	 * @return {type}      description
	 */
	_addToggleLayerEvent(){
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
