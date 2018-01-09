import { Plugin } from './Plugin';

class Paragraph extends Plugin{
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
				cmd: 'formatBlock',
				dropList: [{
					text: 'H1',
					param: '<h1>'
				},{
					text: 'H2',
					param: '<h2>'
				},{
					text: 'H3',
					param: '<h3>'
				},{
					text: 'H4',
					param: '<h4>'
				},{
					text: 'H5',
					param: '<h5>'
				},{
					text: 'H6',
					param: '<h6>'
				}]
			}
		};
		super(_opts, editor);
	}
}

export { Paragraph }
