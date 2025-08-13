import { act, renderHook } from "@testing-library/react";
import { useFullPage } from "./useFullpage";
import { test, expect } from "vitest";

const makeSec = (page: number, { ch = 800, sh = 800, top = 0 } = {}) => {
  const el = document.createElement("section");
  el.dataset.page = page + "";
  Object.defineProperties(el, {
    clientHeight: { value: ch, configurable: true },
    scrollTop: { value: top, writable: true, configurable: true },
    scrollHeight: { value: sh, configurable: true },
  });
  return el as HTMLDivElement;
};

test("초기 curPage 값은 0이다", () => {
  const { result } = renderHook(() => useFullPage());
  //Hook 메소드
  const { curPage } = result.current;
  expect(curPage).toBe(0);
});

test("1페이지에서 2페이지로 이동", () => {
  const { result } = renderHook(() => useFullPage());
  const page_1 = makeSec(0, {});
  const page_2 = makeSec(1, { sh: 1200 });

  result.current.scrollToSection(page_1);
  result.current.scrollToSection(page_2);

  act(() => result.current.movePage(1));
  expect(result.current.curPage).toBe(1);
});

test("하단일때 Next , 상단일때 Prev", () => {
  const { result } = renderHook(() => useFullPage());

  //가상 DOM
  const sec_0 = makeSec(0, { ch: 800, sh: 1200, top: 400 });
  const sec_1 = makeSec(1, { ch: 800, sh: 1200, top: 0 });

  //1로 이동

  result.current.scrollToSection(sec_0);
  result.current.scrollToSection(sec_1);

  act(() => {
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 100 }));
  });

  //1로 변경  ok
  expect(result.current.curPage).toBe(1);

  act(() => {
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));
  });

  expect(result.current.curPage).toBe(0);
});
