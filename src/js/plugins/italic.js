import { Plugin } from './Plugin';

class Italic extends Plugin{
	constructor(editor){
		const _opts = {
			button: {
				title: '字体倾斜',
				icon: 'italic',
				name: 'italic',
				id: 'italic-' + editor.id
			}
		};
		super(_opts, editor);
	}
}

export { Italic }
