import { Plugin } from './Plugin';

class FontSize extends Plugin{
	constructor(editor){
		const _opts = {
			button: {
				title: '字体大小',
				icon: 'text-height',
				name: 'fontSize',
				id: 'font-size-' + editor.id
			}
		};
		super(_opts, editor);
	}
}

export { FontSize }