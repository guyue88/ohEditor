import { Plugin } from './Plugin';

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
				cmd: 'formatBlock',
				cmdParam: 'BLOCKQUOTE'
			}
		};
		super(_opts, editor);
	}
}

export { Quote }
