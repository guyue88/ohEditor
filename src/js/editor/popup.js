import $ from '../util/dom-core';

/**
 * 弹层控制
 */
export class Popup{
	constructor(editor){
		this._editor = editor;
		if(!editor.$toolbar) throw new Error('未发现 toolbar 元素，无法添加弹层！');

		this.$toolbar = $(editor.$toolbar);
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
	}

	/**
	 * render - 渲染弹层，弹层是插件里面定义的，直接将所有定义的插件渲染出来
	 *
	 * @return {type}  description
	 */
	render(){
		this.popupList.forEach(item=>{
			const type = item.type || 'popup';
			switch (type.trim()) {
				case 'drop':
					this._renderDrop(item);
					break;
				default:
					this._renderPopup(item);
					break;
			}
		});
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
		let $list = this._renderList(opts.list, opts.cmd);

		$div.append($list);
		this.$wrap.append($div);

		let $related = this.$toolbar.find(`#oh-btn-${opts.id}`);
		let relatedOffset = $related.offset();
		let left = relatedOffset.left + 'px';
		let top = relatedOffset.top + relatedOffset.height + 'px';

		$div.css({
			left: left,
			top: top,
			display: "none",
			visibility: "visible"
		});
		this._toggleLayer($related);
		this._bindCMD($div);
		return this;
	}

	/**
	 * _renderList - 渲染下拉列表
	 *
	 * @param  {type} list description
	 * @param  {type} cmd 命令
	 * @return {VN}      description
	 */
	_renderList(list, cmd){
		let $ul = $('<ul class="oh-drop-list"></ul>');
		list.forEach(item=>{
			let $li = $(`<li>
				<a href="javascript:;" data-cmd="${cmd}" data-param="${item.param}" title="${item.title||item.text}">
					${item.text}
				</a>
			</li>`);
			$ul.append($li);
		});
		return $ul;
	}

	_bindCMD($div){
		const self = this;
		$div.on('click', 'li a', function(){
			const me = $(this),
				cmd = me.data('cmd'),
				param = me.data('param');

			self._editor.cmd.do(cmd, param);
		});
	}
	/**
	 * _renderPopup - 渲染一个弹层
	 *
	 * @param  {type} opts description
	 * @return {Popup}      description
	 */
	_renderPopup(opts){
		let $div = $(`<div id="oh-popup-${opts.id}" class="oh-layer oh-popup-layer oh-popup-${opts.name}"></div>`);

		if(opts.tabs && Array.isArray(opts.tabs)){
			$div.append(this._renderTabs(opts.tabs));
			$div.append(this._renderCont(opts.tabs));
			this._toggleTab($div);
		}else{
			$div.append(this._renderCont(opts.template));
		}

		this.$wrap.append($div);

		let $related = this.$toolbar.find(`#oh-btn-${opts.id}`);
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
		this._toggleLayer($related);
		return this;
	}

	/**
	 * _renderTabs - 弹层按钮
	 *
	 * @param  {type} tabs description
	 * @return {VN}      description
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

		$button.append($icon);
		return $button;
	}

	_insertWrap(){
		let $div = $('<div class="oh-popup-wrap"></div>');

		this.$toolbar.append($div);
		return $div;
	}

	/**
	 * _toggleTab - 弹层内的tab切换
	 *
	 * @param  {VN} $layer description
	 * @return {type}      description
	 */
	_toggleTab($layer){
		$layer.on('click', '.oh-popup-tab li', function(e){
			let me = $(this),
				index = me.index(),
				$pop = me.parents('.oh-popup-layer').find('.oh-popup-child');

			me.addClass('oh-active').siblings().removeClass('oh-active');
			$pop.eq(index).addClass('oh-active').siblings().removeClass('oh-active');
			return false;
		});
	}


	/**
	 * _toggleLayer - 弹层的关闭与显示控制
	 *
	 * @param  {VN} $btn description
	 * @return {type}      description
	 */
	_toggleLayer($btn){
		const self = this;
		const $layer = $('.oh-wrap .oh-layer');
		$btn.on('click', function(e){
			var me = $(this),
				$popup = self.$toolbar.find(`#${me.data('popup')}`);

			$popup.show();
			return false;
		});

		$layer.on('click', function(e) {
			e.stopPropagation();
			e.cancelBubble = true;
		});
		/*点击其他地方关闭弹层*/
		$(document).on('click', function(){
			$layer.hide();
		});
	}
}
