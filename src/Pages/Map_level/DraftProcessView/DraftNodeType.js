
import LabelNode from '../../../AllNode/LabelNode';
import PublishSwimlineBoxNode from '../../../AllNode/PublishAllNode/PublishSwimlineBoxNode';
import PublishSwimlineDiamondNode from '../../../AllNode/PublishAllNode/PublishSwimlineDiamondNode';
import PublishSwimlineRightsideBox from '../../../AllNode/PublishAllNode/PublishSwimlineRightsideBox';
import DraftSwimlaneArrowNode from '../../../AllNode/DraftViewNode/DraftSwimlaneArrowNode';
import FreeTextNode from '../../../AllNode/FreeTextNode';
import StickyNote from '../../../AllNode/StickyNote';

const DraftNodeType = {
  progressArrow: DraftSwimlaneArrowNode,
  diamond: PublishSwimlineDiamondNode,
  box: PublishSwimlineBoxNode,
  SwimlineRightsideBox: PublishSwimlineRightsideBox,
  label: LabelNode,
  // Yes: YesNode,
  // No: NoNode,
   FreeText: FreeTextNode,
     StickyNote: StickyNote,
   
};

export default DraftNodeType;