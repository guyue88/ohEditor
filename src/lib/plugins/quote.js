import Plugin from './Plugin';
import $ from '../util/dom-core';

export default class Quote extends Plugin{
	constructor(editor){
		const id = 'quote-' + editor.id;
		const name = 'quote';
		const _opts = {
			button: {
				title: '引用',
				icon: 'quote-left',
				name: name,
				id: id,
				cmd: 'blockquote'
			}
		};
		super(_opts, editor);
		this._resetCmd();
	}

	/**
	 * _resetCmd - 重置blockquote命令
	 *
	 * @return {type}  description
	 */
	_resetCmd(){
		this._editor.Cmd._blockquote = this._cmdBlockquote;
	}

	/**
	 * _cmdBlockquote - `引用`命令处理
	 *
	 * @return {type}  description
	 */
	_cmdBlockquote(){
		const selection = this._editor.Selection,
			cmd = this._editor.Cmd,
			range = selection.getRange(),
			blockName = this._editor._opts.allowDivTransToP ? 'p' : 'div';

		if(range) {
			const parent = range.commonAncestorContainer.parentNode;
			/*取消引用*/
			if (parent.nodeType === 1 && parent.nodeName.toLowerCase() === "blockquote") {
				const $parent = $(parent),
					html = $parent.html();
				$parent.after(`<${blockName}>${html}</${blockName}>`).remove();
			} else {
				cmd.do('formatBlock', 'BLOCKQUOTE');
			}
		} else {
			cmd.do('formatBlock', 'BLOCKQUOTE');
		}
	}
}
