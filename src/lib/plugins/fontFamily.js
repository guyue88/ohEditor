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
				cmd: 'fontFamily',
				dropList: [{
					html: '<span style="font-family: \'Microsoft Yahei\'">微软雅黑</span>',
					param: 'Microsoft Yahei'
				},{
					html: '<span style="font-family: SimSun">宋体</span>',
					param: 'SimSun'
				},{
					html: '<span style="font-family: Arial">Arial</span>',
					param: 'Arial'
				},{
					html: '<span style="font-family: Helvetica">Helvetica</span>',
					param: 'Helvetica'
				},{
					html: '<span style="font-family: Tahoma">Tahoma</span>',
					param: 'Tahoma'
				}]
			}
		};
		super(_opts, editor);
		this.resetCmd();
	}


	/**
	 * resetCmd - 重置fontFamily命令
	 *
	 * @return {type}  description
	 */
	resetCmd(){

	}
}

export { FontFamily }
