import Plugin from './Plugin';

export default class Italic extends Plugin{
	constructor(editor){
		const id = 'italic-' + editor.id;
		const name = 'italic';
		const _opts = {
			button: {
				title: '字体倾斜',
				icon: 'italic',
				name: name,
				id: id,
				cmd: 'italic'
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
