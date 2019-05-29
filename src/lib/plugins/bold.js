import Plugin from './Plugin';

export default class Bold extends Plugin{
	constructor(editor){
		const name = 'bold';
		const id = `${name}-${editor.id}`;
		const _opts = {
			button: {
				id,
				name,
				title: '加粗',
				icon: 'bold',
				cmd: 'bold'
			}
		};
		super(_opts, editor);
	}
}
