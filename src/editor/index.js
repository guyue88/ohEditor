import { Button } from './button';
import { Popup } from './popup';
import { Command } from './command';
import { Selection } from './selection';
import $ from '../util/dom-core';

import '../scss/style.scss';
import '../scss/content.scss';

/*编辑器编号*/
let id = 1;

/*toolbar: [
	'paragraph', 'quote', 'fontFamily', 'fontSize', 'bold', 'italic', 'color',
	'underline', 'strikeThrough', '|', 'align', 'ol', 'ul', 'insertLink', 'unlink',
	'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'insertHR',
	'clearFormatting', 'print', 'help', 'html', '|', 'undo', 'redo', 'fullscreen'
],*/
export default class OhEditor {
	constructor(elemId, opts) {
		const _opts = {
			toolbar: [
				'paragraph', 'quote', 'fontFamily', 'fontSize', '-', 'bold', 'italic', '|', 'insertImage',
			],
			minHeight: '300px',
			minWidth: '100%',
			initialContent: '欢迎使用ohEditor!',
			allowDivTransToP: true,
			useStyleWithCSS: true,
		};

		this.id = id;
		id++;

		this._opts = {..._opts, opts};
		this.$editor = $('#'+elemId);
		this._init();
	}

	/**
	 * 初始化操作
	 *
	 */
	_init() {
		this.$wrap = void 0;
		this.$toolbar = void 0;
		this.$container = void 0;
		/*Button实例*/
		this.Button = new Button(this);
		/*Popup实例*/
		this.Popup = new Popup(this);
		/*命令实例*/
		this.Cmd = new Command(this);
		/*selection实例*/
		this.Selection = new Selection();
		if (this._opts.useStyleWithCSS) {
			this.Cmd.do('styleWithCSS', true);
		}
	}

	/**
	 * 入口，创建编辑器
	 * @return {OhEditor} OhEditor实例
	 */
	create() {
		this._initFrame();
		this.refresh();
		this._bindCmd();
		this._bindEvent();
		return this;
	}

	/**
	 * html - 获取编辑区源代码
	 *
	 * @return {string}  编辑区源代码
	 */
	html(){
		return this.$container && this.$container.html();
	}

	/**
	 * disable - 禁用编辑
	 *
	 * @return {OhEditor} OhEditor实例
	 */
	disable(){
		this.$container.attr('contenteditable', 'false');
		return this;
	}

	/**
	 * refresh - 刷新按钮和弹层，用于注册插件后初始或重新生成按钮和弹层
	 *
	 * @return {OhEditor} OhEditor实例
	 */
	refresh(){
		this._renderButton();
		this._renderPopup();
		return this;
	}

	/**
	 * 注册插件
	 * @param {function} [plugins] [一个或者多个插件]
	 * @return {OhEditor} OhEditor实例
	 */
	install(...plugins) {
		plugins.forEach(plugin => {
			new plugin(this);
		});
		return this;
	}

	/**
	 * _renderButton - 渲染按钮到控制栏，按用户定义的顺序
	 * 
	 * @private
	 * @return {OhEditor} OhEditor实例
	 */
	_renderButton() {
		if (!this._opts.toolbar || !this.Button) return this;
		this._opts.toolbar.forEach(name => {
			this.Button.render(name);
		});

		return this;
	}

	/**
	 * _renderPopup - 渲染弹层
	 *
	 * @private
	 * @return {OhEditor}  description
	 */
	_renderPopup(){
		if (!this._opts.toolbar || !this.Button) return this;
		this.Popup.render();

		return this;
	}

	/**
	 * 初始化编辑器主体DOM结构
	 * 
	 * @private
	 * @return {OhEditor} OhEditor实例
	 */
	_initFrame() {
		this._createWrapDom();
		this._createToolbarDom();
		this._createContainerDom();
		return this;
	}

	/**
	 * 创建wrap
	 * 
	 * @private
	 * @return {OhEditor} OhEditor实例
	 */
	_createWrapDom() {
		let $wrap = $(`<div id="oh-editor${this.id}" class="oh-wrap"></div>`);

		this.$editor.append($wrap);
		this.$wrap = $wrap;
		return this;
	}

	/**
	 * 创建toolbar
	 * 
	 * @private
	 * @return {OhEditor} OhEditor实例
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
	 * 
	 * @private
	 * @return {OhEditor} OhEditor实例
	 */
	_createContainerDom() {
		let $container = $(`
			<div class="oh-container" contenteditable="true" style="width: ${this._opts.minWidth};height: ${this._opts.minHeight}">
				${this._opts.allowDivTransToP ? "<p>" : "<div>"}
					${this._opts.initialContent}
				${this._opts.allowDivTransToP ? "</p>" : "</div>"}
			</div>
		`);

		this.$wrap.append($container);
		this.$container = $container;
		return this;
	}

	/**
	 * _bindCmd - 给[data-cmd]绑定命令
	 *
	 * @private
	 * @param  {VE} $div description
	 * @return {type}      description
	 */
	_bindCmd(){
		const self = this;
		this.$editor.on('click', '[data-cmd]', function(){
			const me = $(this),
				cmd = me.data('cmd'),
				param = me.data('param');

			cmd && self.Cmd.do(cmd, param);
		});
	}

	/**
	 * _bindEvent - 全局状态下的事件监听
	 *
	 * @private
	 * @return {type}  description
	 */
	_bindEvent(){
		const self = this,
			blockElem = this._opts.allowDivTransToP ? '<p><br/></p>' : '<div><br/></div>';

		if(this._opts.allowDivTransToP){
			let timer = void 0;
			this.$container.on('keyup', function(e){
				if(timer) clearTimeout(timer);
				timer = setTimeout(function(){
					/*删除，全部内容删除后需要填充一个空的p*/
					if(e.keyCode === 8){
						if(!self.html()){
							self.$container.prepend(blockElem);
						}
					}
				}, 200);
			});
		}

		/**
		 * 处理换行问题，换行时会复制前一个标签的所有样式及结构
		 * TODO 事件可能被屏蔽，需要需求更好的解决方案
		 **/
		const blockTag = ['blockquote'];
		this.$container.on('keydown', function(e){
			if(e.keyCode === 13){
				const range = self.Selection.getRange(),
					parent = range.commonAncestorContainer.parentNode,
					tagName = parent.nodeType === 1 ? parent.nodeName.toLowerCase() : '';

				if(blockTag.indexOf(tagName) !== -1){
					e.preventDefault();
					const $ele = $(blockElem);
					$(parent).after($ele);
					self.Selection.resetRange($ele[0], 0, $ele[0], 0);
				}
			}
		});

	}
}
