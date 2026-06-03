/**
 * Composition Root — Symbol tokens for dependency injection.
 * Each module registers its use-cases under these keys.
 */
export const TOKENS = {
  auth: {
    login: Symbol("auth:login"),
    register: Symbol("auth:register"),
    logout: Symbol("auth:logout"),
    refreshSession: Symbol("auth:refreshSession"),
    getCurrentUser: Symbol("auth:getCurrentUser"),
  },
  categories: {
    list: Symbol("categories:list"),
    get: Symbol("categories:get"),
    create: Symbol("categories:create"),
    update: Symbol("categories:update"),
    delete: Symbol("categories:delete"),
    restore: Symbol("categories:restore"),
  },
  goals: {
    list: Symbol("goals:list"),
    get: Symbol("goals:get"),
    create: Symbol("goals:create"),
    update: Symbol("goals:update"),
    delete: Symbol("goals:delete"),
    restore: Symbol("goals:restore"),
    listInstances: Symbol("goals:listInstances"),
    completeInstance: Symbol("goals:completeInstance"),
  },
  steps: {
    create: Symbol("steps:create"),
    createBatch: Symbol("steps:createBatch"),
    updateMetadata: Symbol("steps:updateMetadata"),
    updateProgress: Symbol("steps:updateProgress"),
    delete: Symbol("steps:delete"),
    restore: Symbol("steps:restore"),
    reorder: Symbol("steps:reorder"),
  },
  dashboard: {
    getSummary: Symbol("dashboard:getSummary"),
    getTimeline: Symbol("dashboard:getTimeline"),
    getCalendar: Symbol("dashboard:getCalendar"),
    getUpcoming: Symbol("dashboard:getUpcoming"),
  },
  calendar: {
    getEvents: Symbol("calendar:getEvents"),
  },
  activity: {
    list: Symbol("activity:list"),
  },
  trash: {
    list: Symbol("trash:list"),
    restore: Symbol("trash:restore"),
    permanentDelete: Symbol("trash:permanentDelete"),
  },
  settings: {
    updateProfile: Symbol("settings:updateProfile"),
    changePassword: Symbol("settings:changePassword"),
  },
} as const;
