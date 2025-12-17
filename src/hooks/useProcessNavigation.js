import { useNavigate } from "react-router-dom";
import { buildProcessPath } from "../routes/buildProcessPath";

export const useProcessNavigation = () => {
  const navigate = useNavigate();

  const goToProcess = ({
    mode,
    view,
    processId,
    level,
    parentId,
    state,
  }) => {
    const path = buildProcessPath({
      mode,
      view,
      processId,
      level,
      parentId,
    });

    navigate(path, { state });
  };

  return { goToProcess };
};
