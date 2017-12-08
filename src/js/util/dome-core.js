Element.prototype.matches =
	Element.prototype.matches ||
	Element.prototype.matchesSelector ||
	Element.prototype.mozMatchesSelector ||
	Element.prototype.msMatchesSelector ||
	Element.prototype.oMatchesSelector ||
	Element.prototype.webkitMatchesSelector ||
	function(s) {
		var matches = (this.document || this.ownerDocument).querySelectorAll(s),
			i = matches.length;
		while (--i >= 0 && matches.item(i) !== this) {}
		return i > -1;
	};

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
		return Array.isArray(result) ? result : [result];
	}
}

/* 是否是 DOM List*/
function isDOMList(list) {
	if (!list) return false;
	if (list instanceof HTMLCollection || list instanceof NodeList
		|| ( Array.isArray(list) && list.length && (list[0].nodeType === 1 || list[0].nodeType === 9)))  {
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
		if(index < 0) index = index + this.length;
		return this[index];
	}

	first() {
		return this.get(0);
	}

	last() {
		return this.get(- 1);
	}

	eq(index){
		if(index === undefined) return this;
		return new DomElement(this.get(index));
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

	on(type, selector, fn){
		/*没有传selector， 则不用代理*/
		if(!fn){
			fn = selector;
			selector = null;
		}

		/*可能有多个事件*/
		let types = type.split(/\s+/);

		return this.each(elem => {
			types.forEach(type => {
				if (!type) return;

				/*记录事件*/
				allEvent.push({
					elem: elem,
					type: type,
					fn: fn
				});

				if (!selector) {
					/*无代理*/
					elem.addEventListener(type, fn);
					return;
				}

				/*有代理*/
				elem.addEventListener(type, e => {
					let target = e.target;
					const currentTarget = e.currentTarget;
					/*遍历外层并且匹配*/
					while (target !== currentTarget) {
						/*判断是否匹配到我们所需要的元素上*/
						if (target.matches(selector)) {
							/*执行绑定的函数*/
							let res = fn.call(target, e);

							if(!res){
								e.preventDefault;
								e.returnValue = false;
								e.stopPropagation();
								e.cancelBubble = true;
							}
							break;
						}
						target = target.parentNode;
					}

				});
			});
		});
	}

	off(){

	}

	siblings( selector ) {
		let result = [];
		this.each(elem=>{
			result = result.concat( sibling( ( elem.parentNode || {} ).firstChild, elem ) );
		});

		return new DomElement(result).filter(selector);
	}

	next( selector ) {
		let result = [];
		this.each(elem=>{
			result = result.concat( elem.nextSibling );
		});

		return new DomElement(result).filter(selector);
	}

	prev( selector ) {
		let result = [];
		this.each(elem=>{
			result = result.concat( elem.previousSibling );
		});

		return new DomElement(result).filter(selector);
	}

	nextAll( selector ) {
		let result = [];
		this.each(elem=>{
			result = result.concat( dir( elem, "nextSibling" ) );
		});

		return new DomElement(result).filter(selector);
	}

	prevAll( selector ) {
		let result = [];
		this.each(elem=>{
			result = result.concat( dir( elem, "previousSibling" ) );
		});

		return new DomElement(result).filter(selector);
	}

	parent( selector ) {
		let result = [];
		this.each(elem=>{
			let parent = elem.parentNode;
			if(parent && parent.nodeType !== 11){
				result = result.concat( parent );
			}
		});

		return new DomElement(result).filter(selector);
	}

	parents( selector ) {
		let result = [];
		this.each(elem=>{
			result = result.concat( dir( elem, "parentNode" ) );
		});

		return new DomElement(result).filter(selector);
	}

	/**
	 * filter - 过滤
	 *
	 * @param  {string|DomElement|HTMLElement} selector description
	 * @return {type}          description
	 */
	filter(selector){
		if(!selector) return this;
		let result = [];
		if(selector instanceof DomElement){
			this.each(elem=>{
				selector.each(preElem=>{
					elem === preElem && result.push(elem);
				});
			});
		}else if(selector.nodeType === 1){
			this.each(elem=>{
				elem === selector && result.push(elem);
			});
		}else if(typeof selector === 'string'){
			this.each(elem=>{
				elem.matches(selector) && result.push(elem);
			});
		}
		return new DomElement(result);
	}

	index( selector ) {

		// No argument, return index in parent
		if ( !selector ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.eq(0).prevAll().length : -1;
		}

		// index in selector
		if ( typeof selector === "string" ) {
			return [].indexOf.call( new DomElement( selector ), this[ 0 ] );
		}
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

		return this.each(elem => {
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
					const styleName = formatStyleName(name);
					elem.style[styleName] = key[name];
				}
			});
		}else if(!val){
			const styleName = formatStyleName(key);
			const elem = this.get(0);
			if(elem){
				let style = document.defaultView.getComputedStyle(elem, null);
				return style[styleName];
			}
			return '';
		}else if(typeof key === 'string'){
			const styleName = formatStyleName(key);
			return this.each(elem => {
				elem.style[styleName] = val;
			});
		}
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
	html(val) {
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

	data(key, val){
		key = formatStyleName(key);
		if(!val){
			return this.get(0).dataset[key];
		}else{
			return this.each(elem=>{
				elem.dataset[key] = val;
			});
		}
	}

	width(){
		return parseFloat(this.eq(0).css('width'));
	}

	height(){
		return parseFloat(this.eq(0).css('height'));
	}

	offset(){
		const elem = this.get(0);
		return {
			left: elem.offsetLeft,
			top: elem.offsetTop,
			width: elem.offsetWidth,
			height: elem.offsetHeight,
		}
	}
}

/**
 * formatStyleName - 将 background-color 变为backgroundColor
 *
 * @param  {string} name description
 * @return {string}      description
 */
function formatStyleName(name){
	if(typeof name !== 'string') return name;
	return name.replace(/(-\w)/img, function($0,$1){
		return $1.replace('-', '').toUpperCase();
	});
}

function dir( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
}

function sibling(first, elem) {
	var matched = [];

	for (; first; first = first.nextSibling) {
		if (first.nodeType === 1 && first !== elem) {
			matched.push(first);
		}
	}

	return matched;
}

export default function $(selector) {
	return new DomElement(selector);
}

window.$ = $;
