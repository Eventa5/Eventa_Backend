import { ActivityStep } from "@prisma/client";

export const ActivityStepOrder: ActivityStep[] = [
  ActivityStep.activityType,
  ActivityStep.categories,
  ActivityStep.basic,
  ActivityStep.content,
  ActivityStep.ticketTypes,
  ActivityStep.published,
];

export const ActivityStepMap = {
  activityType: 1,
  categories: 2,
  basic: 3,
  content: 4,
  ticketTypes: 5,
  published: 6,
};

export function shouldUpdateStep(curr: ActivityStep, target: ActivityStep): boolean {
  const currentStep = ActivityStepMap[curr];
  const targetStep = ActivityStepMap[target];
  return targetStep > currentStep;
}
