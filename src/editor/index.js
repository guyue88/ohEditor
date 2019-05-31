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
			insertImage: {
				target: 'http://localhost:9090/upload',
				uploadKey: 'image',
				useBase64: true,
				maxBase64Size: 50000,
			}
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
		this.isReady = false;
		this._readyWatchList = [];
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
		this.Cmd.do('defaultParagraphSeparator', this._opts.allowDivTransToP ? 'p' : 'div');
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

		/* 将光标移动到容器最后面 */
		this.Selection.setRangeEndOfElement(this.$container.get(0));

		this.isReady = true;
		while (this._readyWatchList.length) {
			const fn = this._readyWatchList.shift();
			fn(this);
		}
		return this;
	}

	/**
	 * 编辑器已经准备好，可以对编辑器进行操作
	 *
	 * @param {function} callback 回调
	 * @memberof OhEditor
	 */
	ready(callback) {
		if (this.isReady) {
			callback && callback(this);
		} else {
			this._readyWatchList.push(callback);
		}
		return this;
	}

	/**
	 * 获取编辑区源代码
	 *
	 * @return {string}  编辑区源代码
	 */
	get html() {
		return this.$container && this.$container.html();
	}

	/**
	 * 设置编辑器区域初始代码
	 * 
	 * @return {OhEditor} OhEditor实例
	 */
	set html(html) {
		this.$container && this.$container.html(html);
		return this;
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
	 * 渲染按钮到控制栏，按用户定义的顺序
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
	 * 渲染弹层
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
		const wrap = this._createWrapDom();
		const toolbar = this._createToolbarDom();
		const container = this._createContainerDom();

		this.$wrap = $(wrap);
		this.$toolbar = $(toolbar);
		this.$container = $(container);

		this.$editor.html('');
		this.$wrap.append(this.$toolbar);
		this.$wrap.append(this.$container);
		this.$editor.append(this.$wrap);
		return this;
	}

	/**
	 * 创建wrap
	 * 
	 * @private
	 * @return {string} DOM string
	 */
	_createWrapDom() {
		return `<div id="oh-editor${this.id}" class="oh-wrap"></div>`;
	}

	/**
	 * 创建toolbar
	 * 
	 * @private
	 * @return {string} DOM string
	 */
	_createToolbarDom() {
		if (!this._opts.toolbar || !this._opts.toolbar.length) {
			console.warn('没有定义 toolbar ，无法操作编辑器！');
			return '';
		}
		return '<div class="oh-toolbar"></div>';
	}

	/**
	 * 创建可视编辑区
	 * 
	 * @private
	 * @return {string} DOM string
	 */
	_createContainerDom() {
		const initialContent = this.$editor.html();
		return `
			<div class="oh-container" contenteditable="true" style="width: ${this._opts.minWidth};height: ${this._opts.minHeight}">
				${this._opts.allowDivTransToP ? "<p>" : "<div>"}
					${initialContent.trim() || this._opts.initialContent}
				${this._opts.allowDivTransToP ? "</p>" : "</div>"}
			</div>
		`;
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
