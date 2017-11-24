import { Image } from './image';
import { Bold } from './bold';
import { FontFamily } from './fontFamily';
import { FontSize } from './fontSize';
import { Italic } from './italic';
import { Paragraph } from './paragraph';
import { Quote } from './quote';

const PLUGINLIST = [Image, Bold, FontSize, FontFamily, Italic, Paragraph, Quote];

function plugins(editor){
	PLUGINLIST.forEach(plugin=>{
		new plugin(editor);
	});
}

export { plugins };