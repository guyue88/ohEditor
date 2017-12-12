import { Plugin } from './Plugin';

class FontSize extends Plugin{
	constructor(editor){
		this._editor = editor;
		
		const id = 'font-size-' + editor.id;
		const name = 'fontSize';
		const _opts = {
			button: {
				title: '字体大小',
				icon: 'text-height',
				name: name,
				id: id,
				type: 'drop'
			},
			popup: {
				id: id,
				name: name,
				type: 'drop',
				cmd: 'fontSize',
				list: [{
					text: 10,
					param: '10px'
				},{
					text: 11,
					param: '11px'
				},{
					text: 12,
					param: '12px'
				},{
					text: 14,
					param: '14px'
				},{
					text: 16,
					param: '16px'
				},{
					text: 18,
					param: '18px'
				},{
					text: 24,
					param: '24px'
				},{
					text: 30,
					param: '30px'
				},{
					text: 36,
					param: '36px'
				},{
					text: 48,
					param: '48px'
				},{
					text: 60,
					param: '60px'
				}]
			}
		};
		super(_opts, editor);
	}
}

export { FontSize }
