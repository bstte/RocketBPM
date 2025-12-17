export const PROCESS_ROUTES = {
  MAP: "/:mode/map/:processId",
  MAP_LEVEL: "/:mode/map/:processId/:level/:parentId",

  SWIMLANE: "/:mode/swimlane/:processId",
  SWIMLANE_LEVEL: "/:mode/swimlane/:processId/:level/:parentId",
};

export const PROCESS_MODES = {
  EDIT: "edit",
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const PROCESS_VIEWS = {
  MAP: "map",
  SWIMLANE: "swimlane",
};
