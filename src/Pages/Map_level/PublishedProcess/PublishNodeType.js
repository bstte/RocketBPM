
import LabelNode from '../../../AllNode/LabelNode';
import YesNode from '../../../AllNode/YesNode';
import NoNode from '../../../AllNode/NoNode';
import PublishSwimlineArrowBoxNode from '../../../AllNode/PublishAllNode/PublishSwimlineArrowBoxNode';
import PublishSwimlineBoxNode from '../../../AllNode/PublishAllNode/PublishSwimlineBoxNode';
import PublishSwimlineDiamondNode from '../../../AllNode/PublishAllNode/PublishSwimlineDiamondNode';
import PublishSwimlineRightsideBox from '../../../AllNode/PublishAllNode/PublishSwimlineRightsideBox';
import FreeTextNode from '../../../AllNode/FreeTextNode';
import StickyNote from '../../../AllNode/StickyNote';

const PublishNodeType = {
  progressArrow: PublishSwimlineArrowBoxNode,
  diamond: PublishSwimlineDiamondNode,
  box: PublishSwimlineBoxNode,
  SwimlineRightsideBox: PublishSwimlineRightsideBox,
  label: LabelNode,
  // Yes: YesNode,
  // No: NoNode,
   FreeText: FreeTextNode,
     StickyNote: StickyNote,
   
};

export default PublishNodeType;