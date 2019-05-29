/**
 * 富文本操作命令封装
 */
export class Command{
	constructor(editor){
		this._editor = editor;
	}

	/**
	 * do - 执行document.execCommand对编辑区域进行操作
	 *
	 * @param  {string} name  操作类型
	 * @param  {string} value 需要设置的值
	 * @return {type}       description
	 */
	do(name, value, showDefaultUI = false) {
		/*如果有自定函数，则执行，否则执行默认事件*/
		const _name = `_${name}`;
		if (this[_name]) {
			this[_name](value)
		} else {
			this._execCommand(name, value, showDefaultUI)
		}
	}

	_execCommand(name, value, showDefaultUI = false) {
		return document.execCommand(name, showDefaultUI, value);
	}

	queryCommandValue(name) {
		return document.queryCommandValue(name);
	}

	queryCommandState(name) {
		return document.queryCommandState(name);
	}

	queryCommandSupported(name) {
		return document.queryCommandSupported(name);
	}
}
