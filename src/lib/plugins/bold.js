import Plugin from './Plugin';

export default class Bold extends Plugin{
	constructor(editor){
		const _opts = {
			button: {
				title: '加粗',
				icon: 'bold',
				name: 'bold',
				id: 'bold-' + editor.id,
				cmd: 'bold'
			}
		};
		super(_opts, editor);
	}
}
