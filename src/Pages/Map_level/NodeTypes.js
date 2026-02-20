import SwimlineArrowBoxNode from '../../AllNode/SwimlineNodes/SwimlineArrowBoxNode';
import SwimlineBoxNode from '../../AllNode/SwimlineNodes/SwimlineBoxNode';
import SwimlineDiamondNode from '../../AllNode/SwimlineNodes/SwimlineDiamondNode';
import SwimlineRightsideBox from '../../AllNode/SwimlineNodes/SwimlineRightsideBox';
import LabelNode from '../../AllNode/LabelNode';

import FreeTextNode from '../../AllNode/FreeTextNode';


const NodeTypes = {
  progressArrow: SwimlineArrowBoxNode,
  diamond: SwimlineDiamondNode,
  box: SwimlineBoxNode,
  SwimlineRightsideBox: SwimlineRightsideBox,
  label: LabelNode,
  FreeText: FreeTextNode,


};

export default NodeTypes;



