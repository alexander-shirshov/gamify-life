export const TASK_CATEGORIES = ['easy', 'medium', 'hard'] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];
