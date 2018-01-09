import { Plugin } from './Plugin';

class FontFamily extends Plugin{
	constructor(editor){
		const id = 'font-family-' + editor.id;
		const name = 'fontFamily';
		const _opts = {
			button: {
				title: '选择字体',
				icon: 'font',
				name: name,
				id: id,
				type: 'drop'
			},
			popup: {
				id: id,
				name: name,
				type: 'drop',
				cmd: 'fontSize',
				dropList: [{
					text: 10,
					param: 10
				},{
					text: 11,
					param: 11
				},{
					text: 12,
					param: 12
				},{
					text: 14,
					param: 14
				},{
					text: 16,
					param: 16
				},{
					text: 18,
					param: 18
				},{
					text: 24,
					param: 24
				},{
					text: 30,
					param: 30
				},{
					text: 36,
					param: 36
				},{
					text: 48,
					param: 48
				},{
					text: 60,
					param: 60
				}]
			}
		};
		super(_opts, editor);
	}
}

export { FontFamily }
