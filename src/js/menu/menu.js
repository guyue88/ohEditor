class Menu{
	constructor($toolbar){
		if(!$toolbar) throw new Error('未发现 toolbar 元素，无法添加按钮！');

		this.$toolbar = $toolbar;
	}

	/**
	 * 添加一个按钮
	 * @param {[Object]} [opts] [按钮参数，包含title|icon|name]
	 * @return {[element]} 按钮元素
	 */
	addMenu(opts){
		let $button = document.createElement('button');
		let $icon = document.createElement('span');

		$button.setAttribute('type', 'button');
		$button.setAttribute('id', `oh-${opts.name}`);
		$button.setAttribute('class', `oh-menu`);
		$button.setAttribute('title', opts.title);
		$icon.setAttribute('class', `fa fa-${opts.icon}`);

		$button.append($icon);
		this.$toolbar.append($button);
		return $button;
	}
}

export { Menu };