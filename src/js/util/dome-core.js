/*所有事件记录，便于解绑*/
const allEvent = [];

/**
 * createElement - 通过创建div，并返回其子元素，创建dom
 *
 * @param  {string} html html片段
 * @return {HTMLElement}      description
 */
function createElement(html) {
	let div = document.createElement('div');
	div.innerHTML = html;
	return div.children;
}


/**
 * querySelectorAll - 封装querySelectorAll，并返回数组DOMList
 *
 * @param  {string} selector 选择器
 * @param  {DOMList} scope 父容器
 * @return {DOMList}          description
 */
function querySelectorAll(selector, scope) {
	let result;
	if(!scope){
		result = document.querySelectorAll(selector);
	}else{
		result = [];
		for(let i = 0, len = scope.length; i < len ; i++){
			result = result.concat(Array.from(scope[i].querySelectorAll(selector)));
		}
	}

	if (isDOMList(result)) {
		return result;
	} else {
		return [result];
	}
}

/* 是否是 DOM List*/
function isDOMList(list) {
	if (!list) return false;
	if (list instanceof HTMLCollection || list instanceof NodeList
		|| list[0].nodeType === 1 || list[0].nodeType === 9)  {
		return true;
	}
	return false;
}

class DomElement {
	constructor(selector, scope) {
		if (!selector) return;

		// selector 本来就是 DomElement 对象，直接返回
		if (selector instanceof DomElement) return selector;

		this.selector = selector;
		this.length = 0;
		const nodeType = selector.nodeType;

		let result = [];

		/*document 节点 或者 单个 DOM 节点*/
		if (nodeType === 9 || nodeType === 1) {
			result = [selector];
		} else if (isDOMList(selector) || selector instanceof Array) {
			/*DOM List 或者数组*/
			result = selector;
		} else if (typeof selector === 'string') {
			/*字符串*/
			selector = selector.trim();

			/*需要生成dom*/
			if (/^</.test(selector)) {
				result = createElement(selector);
			} else {
				/*选择器，scope必须是DomElement或者字符串*/
				if(scope){
					if(typeof scope === 'string'){
						result = querySelectorAll(selector, querySelectorAll(scope));
					}else if(scope instanceof DomElement){
						result = querySelectorAll(selector, scope);
					}else{
						result = [];
					}
				}else{
					result = querySelectorAll(selector);
				}
			}
		}

		const length = result.length;
		if (!length) return this;

		// 加入 DOM 节点
		let i;
		for (i = 0; i < length; i++) {
			this[i] = result[i];
		}
		this.length = length;
	}

	each(fn) {
		let i;
		for (i = 0; i < this.length; i++) {
			const elem = this[i];
			const result = fn.call(elem, elem, i);
			if (result === false) {
				break;
			}
		}
		return this;
	}

	clone(deep) {
		const cloneList = [];
		this.each(elem => {
			cloneList.push(elem.cloneNode(!!deep));
		});
		return new DomElement(cloneList);
	}

	size(){
		return this.length;
	}

	get(index) {
		return this[index];
	}

	first() {
		return this.get(0);
	}

	last() {
		return this.get(this.length - 1);
	}

	attr(key, val) {
		if (!val) {
			return this[0].getAttribute(key);
		} else {
			return this.each(elem => {
				elem.setAttribute(key, val);
			});
		}
		return this;
	}

	addClass(className) {
		if (!className) return this;

		return this.each(elem => {
			let arr;
			if (elem.className) {

				arr = elem.className.split(/\s/);
				arr = arr.filter(item => {
					return !!item.trim();
				});

				if (arr.indexOf(className) < 0) {
					arr.push(className);
				}

				elem.className = arr.join(' ');
			} else {
				elem.className = className;
			}
		});
	}


	removeClass(className) {
		if (!className) return this;

		return this.forEach(elem => {
			let arr;
			if (elem.className) {

				arr = elem.className.split(/\s/)
				arr = arr.filter(item => {
					item = item.trim();

					if (!item || item === className) {
						return false;
					}
					return true;
				});

				elem.className = arr.join(' ');
			}
		});
	}

	css(key, val) {
		if(typeof key === 'object'){
			/*json格式*/
			return this.each(elem => {
				for(let name in key){
					const styleName = this._formatStyleName(name);
					elem.style[styleName] = key[name];
				}
			});
		}else if(!val){
			const styleName = this._formatStyleName(key);
			const elem = this.get(0);
			if(elem){
				let style = document.defaultView.getComputedStyle(elem, null);
				return style[styleName];
			}
			return '';
		}else if(typeof key === 'string'){
			const styleName = this._formatStyleName(key);
			return this.each(elem => {
				elem.style[styleName] = val;
			});
		}
	}

	/**
	 * _formatStyleName - 将 background-color 变为backgroundColor
	 *
	 * @param  {string} name description
	 * @return {string}      description
	 */
	_formatStyleName(name){
		if(typeof name !== 'string') return name;
		return name.replace(/(-\w)/img, function($0,$1){
			return $1.replace('-', '').toUpperCase();
		});
	}

	/*显示*/
	show() {
		return this.css('display', 'block')
	}

	/*隐藏*/
	hide() {
		return this.css('display', 'none')
	}

	/*增加子节点*/
	append($children) {
		return this.each(elem => {
			$children.each(child => {
				elem.appendChild(child);
			});
		});
	}

	/*移除当前节点*/
	remove() {
		return this.each(elem => {
			if (elem.remove) {
				elem.remove();
			} else {
				const parent = elem.parentElement;
				parent && parent.removeChild(elem);
			}
		});
	}

	find(selector) {
		let result = [];
		this.each(elem=>{
			result = result.concat(querySelectorAll(selector, [elem]));
		});

		return new DomElement(result);
	}

	/*获取当前元素的 text*/
	text(val) {
		if(!val){
			const elem = this[0];
			return elem.innerText;
		}else{
			return this.each(elem => {
				elem.innerText = val;
			});
		}
	}

	/*获取 html*/
	html(value) {
		if(!val){
			const elem = this[0];
			return elem.innerHTML;
		}else{
			return this.each(elem => {
				elem.innerHTML = val;
			});
		}
	}

	/*获取 value*/
	val(val) {
		if(!val){
			const elem = this[0];
			return elem.value.trim();
		}else{
			return this.each(elem => {
				elem.value = val;
			});
		}
	}
}

export default function $(selector) {
	return new DomElement(selector);
}

window.$ = $;
