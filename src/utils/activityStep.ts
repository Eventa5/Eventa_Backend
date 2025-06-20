import { ActivityStep } from "@prisma/client";

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

export function isSkipStep(curr: ActivityStep, target: ActivityStep): boolean {
  if (curr === ActivityStep.published) return false;
  const currentStep = ActivityStepMap[curr];
  const targetStep = ActivityStepMap[target];

  return targetStep > currentStep + 1;
}
