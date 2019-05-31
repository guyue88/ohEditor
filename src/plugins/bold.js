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
		this.name = name;
		this._initEvent();
	}

	_initEvent(){
		this._editor.ready(() => {
			const $btn = this._editor.Button.getMenuBtn(this.name);
			$btn.on('click', (event, elem) => {
				$(elem).toggleClass('oh-active');
			});
		});
	}
}
