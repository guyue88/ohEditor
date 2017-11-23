/**
 * 控制栏按钮的操作类
 */
class Button{
	constructor($toolbar){
		if(!$toolbar) throw new Error('未发现 toolbar 元素，无法添加按钮！');

		this.$toolbar = $toolbar;
		this.buttonList = {};
	}

	/**
	 * 添加一个按钮
	 * @param {[Object]} [opts] [按钮参数，包含title|icon|name|id]
	 * @return {[element]} 按钮元素
	 */
	pushButton(opts){
		if(!opts || !opts.name) return this;
		this.buttonList[opts.name] = opts;
	}

	/**
	 * 添加按钮到控制栏
	 * @param  {[string]} name [按钮名]
	 * @return {[type]}      [description]
	 */
	render(name){
		if(!this.buttonList[name]) return this;

		const button = this.buttonList[name];
		let $button = document.createElement('button');
		let $icon = document.createElement('span');

		$button.setAttribute('type', 'button');
		$button.setAttribute('id', `oh-${button.id}`);
		$button.setAttribute('class', `oh-menu`);
		$button.setAttribute('title', button.title);
		$icon.setAttribute('class', `fa fa-${button.icon}`);

		$button.append($icon);
		this.$toolbar.append($button);
		return $button;
	}
}

export { Button };