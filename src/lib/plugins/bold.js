import { Plugin } from './Plugin';

class Bold extends Plugin{
	constructor(editor){
        const id = 'bold-' + editor.id;
		const _opts = {
			button: {
				title: '加粗',
				icon: 'bold',
				name: 'bold',
				id: id,
				cmd: 'bold'
			}
		};
        super(_opts, editor);
        this._onClick(id);
    }

    /**
     * @description 点击当前按钮，需要切换选中状态
     * @param {string} id
     * @memberof Bold
     */
    _onClick(id){
        this.editor.$toolbar.on('click', `#oh-btn-${id}`, function () {
            console.log(1);
            const me = $(this);
            me.toggleClass('oh-active');
        });
    }
}

export { Bold }
