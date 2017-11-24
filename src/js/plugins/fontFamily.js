import { Plugin } from './Plugin';

class FontFamily extends Plugin{
	constructor(editor){
		const _opts = {
			button: {
				title: '字体',
				icon: 'font',
				name: 'fontFamily',
				id: 'font-family-' + editor.id,
				type: 'drop'
			}
		};
		super(_opts, editor);
	}
}

export { FontFamily }