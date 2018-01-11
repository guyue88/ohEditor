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

	_cmdBlockquote(){
		const Selection = this._editor.selection;
		const cmd = this._editor.cmd;

		const range = Selection.getRange();

		if(range){
			console.log(range);
			const parent = range.commonAncestorContainer.parentNode;
			if(parent.nodeType === 1 && parent.nodeName.toLowerCase() === "blockquote"){
				/*取消引用*/
				const $parent = $(parent),
					html = $parent.html();
				$parent.after('<div>'+html+'</div>').remove();
			}else{
				cmd.do('formatBlock', 'BLOCKQUOTE');
			}
		}else{
			cmd.do('formatBlock', 'BLOCKQUOTE');
		}
	}
}

export { Quote }
