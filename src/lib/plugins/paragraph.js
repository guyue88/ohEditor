import Plugin from './Plugin';

export default class Paragraph extends Plugin{
	constructor(editor){
		const id = 'paragraph-' + editor.id;
		const name = 'paragraph';
		const _opts = {
			button: {
				title: '段落',
				icon: 'header',
				name: name,
				id: id,
				type: 'drop'
			},
			popup: {
				id: id,
				name: name,
				type: 'drop',
				cmd: 'paragraph',
				dropList: [{
					text: '文本',
					title: '正常文本',
					param: 'normal'
				},{
					title: '标题1',
					html: '<h1>标题1</h1>',
					param: '<h1>'
				},{
					title: '标题2',
					html: '<h2>标题2</h2>',
					param: '<h2>'
				},{
					title: '标题3',
					html: '<h3>标题3</h3>',
					param: '<h3>'
				},{
					title: '标题4',
					html: '<h4>标题4</h4>',
					param: '<h4>'
				},{
					title: '标题5',
					html: '<h5>标题5</h5>',
					param: '<h5>'
				},{
					title: '标题6',
					html: '<h6>标题6</h6>',
					param: '<h6>'
				}]
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
		this._editor.Cmd._paragraph = this._cmdParagraph;
	}


	/**
	 * _cmdParagraph - `段落`命令处理
	 *
	 * @param  {string} value 需要转换的段落值
	 * @return {type}       description
	 */
	_cmdParagraph(value){
		const selection = this._editor.Selection,
			cmd = this._editor.Cmd,
			range = selection.getRange(),
			tagName = value.replace(/[<>]/g,'').toLowerCase(),
			blockName = this._editor._opts.allowDivTransToP ? 'p' : 'div';

		if (range) {
			const parent = range.commonAncestorContainer.parentNode;
			const nodeName = parent.nodeName.toLowerCase();
			const headingList = ['h1', 'h2', 'h3', 'h4', 'h5',' h6'];
			
			if(parent.nodeType === 1 && (
					nodeName === tagName ||
					(tagName.toLowerCase() === 'normal' && headingList.includes(nodeName))
			)) {
				/*取消段落*/
				const $parent = $(parent),
					html = $parent.html();
				$parent.after(`<${blockName}>${html}</${blockName}>`).remove();
			} else if (headingList.includes(tagName)) {
				cmd.do('formatBlock', value);
			}
		} else if (headingList.includes(tagName)) {
			cmd.do('formatBlock', value);
		}
	}
}
