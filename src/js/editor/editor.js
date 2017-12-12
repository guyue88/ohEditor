import {
	Button
} from './button';
import {
	Popup
} from './popup';
import {
	Command
} from './command';
import {
	plugins as PLUGINS
} from '../plugins/index';

import $ from '../util/dom-core';


/*编辑器编号*/
let ID = 1;

class OhEditor {
	constructor(element, opts) {
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
		this.$editor = document.getElementById(element);
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
	 * 创建编辑器
	 * @return {[type]} [description]
	 */
	create() {
		this._initFrame();

		this.cmd = new Command(this);
		this.button = new Button(this);
		this.popup = new Popup(this);

		this._initPlugins();
		this.refresh();

	}

	refresh(){
		this._renderButton();
		this._renderPopup();
	}
	/**
	 * 刷新，渲染按钮到控制栏
	 * @return {OhEditor} [description]
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
	 * 注册插件
	 * @param {function} [plugins] [一个或者多个插件]
	 * @return {[OhEditor]} [OhEditor实例]
	 */
	registerPlugin(...plugins) {
		plugins.forEach(plugin => {
			plugin(this);
		});
		return this;
	}

	/**
	 * 初始化编辑器框架
	 * @return {[OhEditor]} [OhEditor实例]
	 */
	_initFrame() {
		this._createWrapDom();
		this._createToolbarDom();
		this._createContainerDom();
		return this;
	}

	/**
	 * 创建wrap
	 * @return {[type]} [description]
	 */
	_createWrapDom() {
		let $wrap = document.createElement('div');
		$wrap.setAttribute('class', `oh-wrap`);
		$wrap.setAttribute('id', `oh-editor${this.id}`);

		this.$editor.append($wrap);
		this.$wrap = $wrap;
		return this;
	}

	/**
	 * 创建toolbar
	 * @return {[type]} [description]
	 */
	_createToolbarDom() {
		if (!this._opts.toolbar || !this._opts.toolbar.length) {
			console.warn('没有定义 toolbar ，无法操作编辑器！');
			return this;
		}
		let $toolbar = document.createElement('div');
		$toolbar.setAttribute('class', 'oh-toolbar');

		this.$wrap.append($toolbar);
		this.$toolbar = $toolbar;
		return this;
	}

	/**
	 * 创建可视编辑区
	 * @return {[type]} [description]
	 */
	_createContainerDom() {
		let $container = document.createElement('div');

		$container.setAttribute('class', 'oh-container');
		$container.setAttribute('contenteditable', 'true');
		$container.setAttribute('style', `width: ${this._opts.minWidth};height: ${this._opts.minHeight}`);

		this.$wrap.append($container);
		this.$container = $container;
		return this;
	}

	/**
	 * 加载各种默认功能插件
	 * @return {[OhEditor]} [OhEditor实例]
	 */
	_initPlugins() {
		this.registerPlugin(PLUGINS);
		return this;
	}

}

export {
	OhEditor
};
