import { Plugin } from './Plugin';

class FontSize extends Plugin{
	constructor(editor){
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
				dropList: [{
					html: '<span style="font-size: 10px;">10</span>',
					param: '10px'
				},{
					html: '<span style="font-size: 11px">11</span>',
					param: '11px'
				},{
					html: '<span style="font-size: 12px">12</span>',
					param: '12px'
				},{
					html: '<span style="font-size: 14px">14</span>',
					param: '14px'
				},{
					html: '<span style="font-size: 16px">16</span>',
					param: '16px'
				},{
					html: '<span style="font-size: 18px">18</span>',
					param: '18px'
				},{
					html: '<span style="font-size: 24px">24</span>',
					param: '24px'
				},{
					html: '<span style="font-size: 30px">30</span>',
					param: '30px'
				},{
					html: '<span style="font-size: 36px">36</span>',
					param: '36px'
				},{
					html: '<span style="font-size: 48px">48</span>',
					param: '48px'
				},{
					html: '<span style="font-size: 60px">60</span>',
					param: '60px'
				}]
			}
		};
		super(_opts, editor);
		this._editor = editor;
	}
}

export { FontSize }
