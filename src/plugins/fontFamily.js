import Plugin from './Plugin';

export default class FontFamily extends Plugin{
	constructor(editor){
		const id = 'font-family-' + editor.id;
		const name = 'fontFamily';
		const _opts = {
			button: {
				id,
				name,
				title: '选择字体',
				icon: 'font',
				type: 'drop'
			},
			popup: {
				id,
				name,
				type: 'drop',
				cmd: 'fontName',
				dropList: [{
					html: '<span style="font-family: \'Microsoft Yahei\', \'微软雅黑\'">微软雅黑</span>',
					param: '\'Microsoft Yahei\', \'微软雅黑\''
				}, {
					html: '<span style="font-family: STSong, \'华文宋体\'">华文宋体</span>',
					param: 'STSong, \'华文宋体\''
				}, {
					html: '<span style="font-family: Arial,Helvetica,sans-serif">Arial</span>',
					param: 'Arial,Helvetica,sans-serif'
				}, {
					html: '<span style="font-family: Impact, Charcoal, sans-serif">Impact</span>',
					param: 'Impact'
				}, {
					html: '<span style="font-family: Tahoma, Geneva, sans-serif">Tahoma</span>',
					param: 'Tahoma, Geneva, sans-serif'
				}, {
					html: '<span style="font-family: Times New Roman,Times,serif,-webkit-standard">Times New Roman</span>',
					param: 'Times New Roman,Times,serif,-webkit-standard'
				}]
			}
		};
		super(_opts, editor);
	}
}
