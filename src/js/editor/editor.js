import { Button } from './button';
import { Popup } from './popup';
import { Command } from './command';
import { plugins as PLUGINS } from '../plugins/index';

import $ from '../util/dom-core';

/*编辑器编号*/
let ID = 1;

class OhEditor {
	constructor(elementID, opts) {
		const _opts = {
			toolbar: [
				'paragraph', 'quote', 'fontFamily', 'fontSize', 'bold', 'italic', 'color',
				'underline', 'strikeThrough', '|', 'align', 'ol', 'ul', 'insertLink', 'unlink',
				'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'insertHR',
				'clearFormatting', 'print', 'help', 'html', '|', 'undo', 'redo', 'fullscreen'
			],
			minHeight: '300px',
			minWidth: '100%',
			placeHolder: '请输入内容'
		};

		this.id = ID;
		ID++;

		this._opts = Object.assign({}, _opts, opts);
		this.$editor = $('#'+elementID);
		this.$wrap = void 0;
		this.$toolbar = void 0;
		this.$container = void 0;
		/*Button实例*/
		this.button = void 0;
		/*Popup实例*/
		this.popup = void 0;
		/*命令实例*/
		this.cmd = void 0;
	}

	/**
	 * 入口，创建编辑器
	 * @return {OhEditor} [OhEditor实例]
	 */
	create() {
		this._initFrame();

		this.cmd = new Command(this);
		this.button = new Button(this);
		this.popup = new Popup(this);

		this._initPlugins();
		this.refresh();
		this._bindCMD();
		return this;
	}

	/**
	 * refresh - 刷新按钮和弹层，用于初始或重新生成按钮和弹层
	 *
	 * @return {OhEditor} [OhEditor实例]
	 */
	refresh(){
		this._renderButton();
		this._renderPopup();
		return this;
	}

	/**
	 * 注册插件
	 * @param {function} [plugins] [一个或者多个插件]
	 * @return {OhEditor} [OhEditor实例]
	 */
	registerPlugin(...plugins) {
		plugins.forEach(plugin => {
			plugin(this);
		});
		return this;
	}

	/**
	 * 加载各种默认功能插件
	 * @return {OhEditor} [OhEditor实例]
	 */
	_initPlugins() {
		this.registerPlugin(PLUGINS);
		return this;
	}

	/**
	 * _renderButton - 渲染按钮到控制栏，按用户定义的顺序
	 * @return {OhEditor} [OhEditor实例]
	 */
	_renderButton() {
		if (!this._opts.toolbar || !this.button) return this;
		this._opts.toolbar.forEach(name => {
			this.button.render(name);
		});

		return this;
	}

	/**
	 * _renderPopup - 渲染弹层
	 *
	 * @return {OhEditor}  description
	 */
	_renderPopup(){
		if (!this._opts.toolbar || !this.button) return this;
		this.popup.render();

		return this;
	}

	/**
	 * 初始化编辑器框架
	 * @return {OhEditor} [OhEditor实例]
	 */
	_initFrame() {
		this._createWrapDom();
		this._createToolbarDom();
		this._createContainerDom();
		return this;
	}

	/**
	 * 创建wrap
	 * @return {OhEditor} [OhEditor实例]
	 */
	_createWrapDom() {
		let $wrap = $(`<div id="oh-editor${this.id}" class="oh-wrap"></div>`);

		this.$editor.append($wrap);
		this.$wrap = $wrap;
		return this;
	}

	/**
	 * 创建toolbar
	 * @return {OhEditor} [OhEditor实例]
	 */
	_createToolbarDom() {
		if (!this._opts.toolbar || !this._opts.toolbar.length) {
			console.warn('没有定义 toolbar ，无法操作编辑器！');
			return this;
		}
		let $toolbar = $('<div class="oh-toolbar"></div>');

		this.$wrap.append($toolbar);
		this.$toolbar = $toolbar;
		return this;
	}

	/**
	 * 创建可视编辑区
	 * @return {OhEditor} [OhEditor实例]
	 */
	_createContainerDom() {
		let $container = $(`<div class="oh-container" contenteditable="true" style="width: ${this._opts.minWidth};height: ${this._opts.minHeight}"></div>`);

		this.$wrap.append($container);
		this.$container = $container;
		return this;
	}

	/**
	 * _bindCMD - 给[data-cmd]绑定命令
	 *
	 * @param  {VE} $div description
	 * @return {type}      description
	 */
	_bindCMD(){
		const self = this;
		this.$editor.on('click', '[data-cmd]', function(){
			const me = $(this),
				cmd = me.data('cmd'),
				param = me.data('param');

			cmd && self.cmd.do(cmd, param);
		});
	}
}

export { OhEditor };
