import { inject, computed } from "vue";
import { en } from "../locales/en";

export const viLabelsKey = Symbol("vi-labels");

export function useLabels() {
  const labels = inject(viLabelsKey, en);
  return computed(() => labels);
}
