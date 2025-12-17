export const buildProcessPath = ({
  mode,
  view,
  processId,
  level,
  parentId,
}) => {
  if (level !== undefined && parentId !== undefined) {
    return `/${mode}/${view}/${processId}/${level}/${parentId}`;
  }

  return `/${mode}/${view}/${processId}`;
};
