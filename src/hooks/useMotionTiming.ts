import { useReducedMotion } from "motion/react";

export function useMotionTiming() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  function timing(duration: number, delay = 0) {
    return {
      duration: shouldReduceMotion ? 0 : duration,
      delay: shouldReduceMotion ? 0 : delay,
    };
  }

  return { shouldReduceMotion, timing };
}
