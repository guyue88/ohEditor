import { Plugin } from './Plugin';
import $ from '../util/dom-core';

class Quote extends Plugin{
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
		this._editor = editor;
		this.resetCmd();
	}

	/**
	 * resetCmd - 重置blockquote命令
	 *
	 * @return {type}  description
	 */
	resetCmd(){
		this._editor.cmd._blockquote = this._cmdBlockquote;
	}

	/**
	 * _cmdBlockquote - `引用`命令处理
	 *
	 * @return {type}  description
	 */
	_cmdBlockquote(){
		const Selection = this._editor.selection,
			cmd = this._editor.cmd,
			range = Selection.getRange(),
			emptyTagName = this._editor._opts.allowDivTransToP ? 'p' : 'div';

		if(range){
			const parent = range.commonAncestorContainer.parentNode;
			if(parent.nodeType === 1 && parent.nodeName.toLowerCase() === "blockquote"){
				/*取消引用*/
				const $parent = $(parent),
					html = $parent.html();
				$parent.after(`<${emptyTagName}>${html}</${emptyTagName}>`).remove();
			}else{
				cmd.do('formatBlock', 'BLOCKQUOTE');
			}
		}else{
			cmd.do('formatBlock', 'BLOCKQUOTE');
		}
	}
}

export { Quote }
