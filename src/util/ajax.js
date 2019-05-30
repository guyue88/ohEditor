/*
 * ajax实现 https://github.com/AspenLuoQiang/ajax
 * @author lq9328@126.com
 * @date 2017/12/11
 **/


 /*
 * @param {string} opts.url 必选，请求路径
 * @param {string} opts.type 可选，请求类型，默认post，可选get，put等
 * @param {json} opts.data 可选，发送给服务器的数据
 * @param {boolean} opts.async 可选，异步，默认true异步执行
 * @param {string} opts.dataType 可选，预期返回的数据类型，默认为text，可选
 * @param {string} opts.jsonp 可选，jsonp回调参数，默认为"jsonp"用于服务器端接收
 *
 * @return {Promise}
 */
export default function ajax(opts){
	opts = Object.assign({}, {
		url: '',
		type: 'post',
		data: {},
		async: true,
		dataType: 'json',
		jsonp: 'callback',
		jsonpCallback: '',
		processData: true,
		success: function(data){},
		error: function(data){},
	}, opts);

	return new Promise((resolve, reject)=>{

		const XMLHttpReq = getXMLHttpRequest();
		let url = opts.url;
		let data = jsonParse(opts.data);
		let type = opts.type.toLowerCase();
		let sendData = null;
		let dataParam = opts.processData ? param(data) : data;

		if(!opts.url) {
			opts.error && opts.error('No url!');
			reject('No url!');
			return;
		}

		if (type === "jsonp") {

			if(dataParam) {
				url += url.indexOf('?') == -1 ? '?' : '&';
				url += dataParam;
			}else{
				url += url.indexOf('?') == -1 ? '?' : '&';
			}

			let jsonpCallback = opts.jsonpCallback;
			if(!jsonpCallback){
				const time = +new Date();
				jsonpCallback = "jsonp" + time;
			}

			url += opts.jsonp + "=" + jsonpCallback;
			window[jsonpCallback] = function(data){
				const script = document.getElementById(jsonpCallback);
				script && document.getElementsByTagName("head")[0].removeChild(script);

				if(opts.dataType.toLowerCase() === 'json'){
					try{
						data = JSON.parse(data);
					}catch(e){

					}
				}
				opts.success && opts.success(data);
				resolve(data);
			}

			const JSONP = document.createElement("script");
			JSONP.type = "text/javascript";
			JSONP.id = jsonpCallback;
			JSONP.src = url;
			document.getElementsByTagName("head")[0].appendChild(JSONP);
			return;
		} else if (type === 'get') {
			if(dataParam){
				url += url.indexOf('?') == -1 ? '?' : '&';
				url += dataParam;
			}
			XMLHttpReq.open(type, url, opts.async);
		} else {
			XMLHttpReq.open(type, url, opts.async);
			opts.contentType && XMLHttpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			sendData = dataParam;
		}

		XMLHttpReq.send(sendData);
		XMLHttpReq.onreadystatechange = function() {
			if (XMLHttpReq.readyState == 4) {
				if (XMLHttpReq.status == 200) {
					let result = void 0;
					switch (opts.dataType.toLowerCase()) {
						case 'json':
							result = XMLHttpReq.responseText;
							try{
								result = JSON.parse(result);
							}catch(e){

							}
							break;
						case 'xml':
							result = XMLHttpReq.responseXML;
							break;
						default:
							result = XMLHttpReq.responseText;
					}
					opts.success && opts.success(result);
					resolve(result);
				} else {
					opts.error && opts.error();
					reject();
				}
			}
		};
	});
}

/**
 * getXMLHttpRequest - 获取XMLHttpRequest对象
 *
 * @return {XMLHttpRequest}  XMLHttpRequest对象
 */
function getXMLHttpRequest() {
 	var xhr = null;
 	try {
 		xhr = new ActiveXObject("Msxml2.XMLHTTP"); //IE高版本创建XMLHTTP
 	} catch (E) {
 		try {
 			xhr = new ActiveXObject("Microsoft.XMLHTTP"); //IE低版本创建XMLHTTP
 		} catch (E) {
 			xhr = new XMLHttpRequest(); //兼容非IE浏览器，直接创建XMLHTTP对象
 		}
 	}
 	return xhr;
}

/**
 * jsonParse - 格式化json字符串
 *
 * @param  {string} data description
 * @return {type}      description
 */
function jsonParse(data) {
 	if (!data) return {};
 	if (typeof data !== 'object') {
 		try {
 			data = JSON.parse(data);
 		} catch (e) {}
 	}
 	return data;
}

function isEmptyObject(obj) {
	var name;
	for (name in obj) {
		return false;
	}
	return true;
}

/**
 * param - 对象转param字符串
 *
 * @param  {json} obj description
 * @return {string}     description
 */
function param(obj){
	let index = 0,
		str = '';
	for (let key in obj) {
		str += (index !== 0 ? '&' : '') + key + '=' + obj[key];
		index++;
	}
	return str;
}
