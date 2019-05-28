import OhEditor from './lib/editor';
import PLUGINLIST from './lib/plugins';

export default function(elemId, config){
  const inst = new OhEditor(elemId, config);

  inst.install.apply(inst, PLUGINLIST);
  return inst;
}