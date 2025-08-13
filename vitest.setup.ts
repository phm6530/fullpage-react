// vitest.setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

type VoidFn = () => void;

//Gsap Mock
vi.mock("gsap", () => {
  const noop: VoidFn = () => {};
  return {
    default: {
      utils: { toArray: (arr: unknown) => Array.from(arr as unknown[]) },
      timeline: () => ({ to: noop, fromTo: noop }),
      set: noop,
      delayedCall: (_t: number, cb: VoidFn) => {
        cb();
      }, // 즉시 실행
    },
  };
});

//useGsap Mock
vi.mock("@gsap/react", () => ({
  useGSAP: (cb: VoidFn) => {
    cb();
  },
}));
