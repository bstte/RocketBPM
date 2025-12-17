export const getSwimlaneApiByMode = (api, mode) => {
  switch (mode) {
    case "edit":
      return (params) => api.getNodes(...params);

    case "draft":
      return (params) => api.getNodes(...params);

    case "publish":
      return (params) => api.getPublishedNodes(...params);

    default:
      throw new Error("Invalid swimlane mode");
  }
};
