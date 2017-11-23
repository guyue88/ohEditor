import { Image } from './image';
import { Bold } from './bold';
import { FontFamily } from './fontFamily';
import { FontSize } from './fontSize';

const PLUGINLIST = [Image, Bold, FontSize, FontFamily];

function plugins(editor){
	PLUGINLIST.forEach(plugin=>{
		new plugin(editor);
	});
}

export { plugins };