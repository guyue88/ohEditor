import { Image } from './image';

const PLUGINLIST = [Image];

function plugins(editor){
	PLUGINLIST.forEach(plugin=>{
		new plugin(editor);
	})
}

export { plugins };