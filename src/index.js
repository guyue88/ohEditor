import OhEditor from './editor';
import PLUGINLIST from './plugins';

export default function(elemId, config){
  const inst = new OhEditor(elemId, config);

  inst.install.apply(inst, PLUGINLIST);
  return inst;
}