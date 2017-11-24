import { Plugin } from './Plugin';

class Quote extends Plugin{
	constructor(editor){
		const _opts = {
			button: {
				title: '引用',
				icon: 'quote-left',
				name: 'quote',
				id: 'quote-' + editor.id
			}
		};
		super(_opts, editor);
	}
}

export { Quote }