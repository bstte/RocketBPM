import SwimlineArrowBoxNode from '../../AllNode/SwimlineNodes/SwimlineArrowBoxNode';
import SwimlineBoxNode from '../../AllNode/SwimlineNodes/SwimlineBoxNode';
import SwimlineDiamondNode from '../../AllNode/SwimlineNodes/SwimlineDiamondNode';
import SwimlineRightsideBox from '../../AllNode/SwimlineNodes/SwimlineRightsideBox';
import LabelNode from '../../AllNode/LabelNode';
import YesNode from '../../AllNode/YesNode';
import NoNode from '../../AllNode/NoNode';
import FreeTextNode from '../../AllNode/FreeTextNode';
// import StickyNote from '../../AllNode/StickyNote';

const NodeTypes = {
  progressArrow: SwimlineArrowBoxNode,
  diamond: SwimlineDiamondNode,
  box: SwimlineBoxNode,
  SwimlineRightsideBox: SwimlineRightsideBox,
  label: LabelNode,
  Yes: YesNode,
  No: NoNode,
  FreeText: FreeTextNode,
  // StickyNote: StickyNote,

};

export default NodeTypes;



