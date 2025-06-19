import { ActivityStep } from "@prisma/client";

export const ActivityStepOrder: ActivityStep[] = [
  ActivityStep.activityType,
  ActivityStep.categories,
  ActivityStep.basic,
  ActivityStep.content,
  ActivityStep.ticketTypes,
  ActivityStep.published,
];

export function getNextStep(current: ActivityStep): ActivityStep | null {
  const index = ActivityStepOrder.indexOf(current);
  return ActivityStepOrder[index + 1] ?? null;
}

export function isFinalStep(step: ActivityStep): boolean {
  return step === ActivityStepOrder[ActivityStepOrder.length - 1];
}
