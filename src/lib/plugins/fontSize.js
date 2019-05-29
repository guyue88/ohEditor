import Plugin from './Plugin';
import $ from '../util/dom-core';

export default class FontSize extends Plugin{
	constructor(editor){
		const name = 'fontSize';
		const id = 'font-size-' + editor.id;
		const _opts = {
			button: {
				id,
				name,
				title: '字体大小',
				icon: 'text-height',
				type: 'drop'
			},
			popup: {
				id,
				name,
				type: 'drop',
				cmd: 'fontSize',
				dropList: [{
					html: '<span style="font-size: 10px;">10</span>',
					param: '10px'
				},{
					html: '<span style="font-size: 11px">11</span>',
					param: '11px'
				},{
					html: '<span style="font-size: 12px">12</span>',
					param: '12px'
				},{
					html: '<span style="font-size: 14px">14</span>',
					param: '14px'
				},{
					html: '<span style="font-size: 16px">16</span>',
					param: '16px'
				},{
					html: '<span style="font-size: 18px">18</span>',
					param: '18px'
				},{
					html: '<span style="font-size: 24px">24</span>',
					param: '24px'
				},{
					html: '<span style="font-size: 30px">30</span>',
					param: '30px'
				},{
					html: '<span style="font-size: 36px">36</span>',
					param: '36px'
				},{
					html: '<span style="font-size: 48px">48</span>',
					param: '48px'
				},{
					html: '<span style="font-size: 60px">60</span>',
					param: '60px'
				}]
			}
		};
		super(_opts, editor);
		this._resetCmd();
	}

	/**
	 * _resetCmd - 重置fontSize命令
	 *
	 * @return {type}  description
	 */
	_resetCmd(){
		this._editor.Cmd._fontSize = this._cmdFontSize;
	}

	_cmdFontSize(value){
		const selection = this._editor.Selection,
			range = selection.getRange(),
			startOffset = range.startOffset,
			endOffset = range.endOffset,
			elem = range.commonAncestorContainer,
			parent = elem.parentNode;
		
		// console.log(elem, parent, range.startOffset, range.endOffset);
		let span = '';
		if (elem.nodeType === 1 && elem.nodeName.toLocaleLowerCase() === 'span') {
			span = elem;
		} else if (parent.nodeType === 1 && parent.nodeName.toLocaleLowerCase() === 'span') {
			span = parent;
		}
		// 操作的元素在一个span中，并且选定了整个元素的值，则更改该元素css
		if (span && $(span).text() === range.toString()) {
			const $span = $(span);
			$span.css('font-size', value);
			// 如果该元素中还含有其他字体设置的元素，可以清除或者清除他的字体格式
			const $children = $span.children();
			$children.each(elem => {
				const me = $(elem);
				me.css('font-size', null);
				const attrNames = elem.getAttributeNames();
				const len = attrNames.length;
				// 如果是空属性标签或者只有style且style为空则删除这个标签
				if (!len || (len === 1 && attrNames[0] === 'style' && !me.attr('style'))) {
					elem.insertAdjacentText('beforebegin', me.text());
					me.remove();
				}
			});
		} else {
			const node = $(`<span style='font-size: ${value}'></span>`).get(0);
			node.appendChild(range.extractContents());
			range.insertNode(node);
			// 必须重置光标，因为此时文档发生变化了，如果光标不变的并继续进行字体或者其他操作，会导致元素不断被span元素包裹
			selection.resetRange(node.firstChild, 0, node.firstChild, endOffset - startOffset);
			// hack，当在一个带有字体大小的标签的上层再次使用`insertNode`设置字体时，内部原先的标签会会复制并留下一个旧的空标签
			let wrap = '';
			if (elem.nodeType === 1) {
				wrap = elem;
			} else if (parent.nodeType === 1) {
				wrap = parent;
			}
			if (wrap) {
				$(wrap).find('span').each(elem => {
					const me = $(elem);
					if (!me.text()) {
						me.remove();
					}
				});
			}
		}
	}
}
