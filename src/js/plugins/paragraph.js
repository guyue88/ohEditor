import { Plugin } from './Plugin';

class Paragraph extends Plugin{
	constructor(editor){
		const _opts = {
			button: {
				title: '段落',
				icon: 'header',
				name: 'paragraph',
				id: 'paragraph-' + editor.id,
				type: 'drop'
			}
		};
		super(_opts, editor);
	}
}

export { Paragraph }