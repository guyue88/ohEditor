import { Plugin } from './Plugin';

class FontFamily extends Plugin{
	constructor(editor){
		const _opts = {
			button: {
				title: '字体',
				icon: 'font',
				name: 'fontFamily',
				id: 'font-family-' + editor.id
			}
		};
		super(_opts, editor);
	}
}

export { FontFamily }