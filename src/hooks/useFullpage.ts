import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { UseFullpagePropsType } from "./type";

export const useFullPage = ({ duration = 600 }: UseFullpagePropsType = {}) => {
  const [page, setPage] = useState(0);
  const [pageCnt, setPageCnt] = useState(0);
  const pageRefs = useRef<HTMLElement[]>([]);
  const scrollingRef = useRef<boolean>(false);
  const touchedPosition = useRef<number>(null);
  const scope = useRef<HTMLElement>(null);

  // PageMOveHandler..
  const pageMoveHandler = useCallback(
    (page: number, move: "next" | "prev") => {
      scrollingRef.current = true;

      gsap.utils.toArray(pageRefs.current).forEach((sec, idx) => {
        const tl = gsap.timeline({});
        const doms = (sec as HTMLElement).querySelectorAll("[data-animate]");

        if (page >= idx) {
          tl.to(sec as HTMLElement, {
            y: 0,
            ease: "power3.inOut",
            duration: duration / 1000,
            delay: idx * 0.1,
          });

          // DOM Fade In Out
          if (doms.length > 0) {
            doms.forEach((el, itemIdx) => {
              if (page === idx) {
                gsap.fromTo(
                  el,
                  {
                    opacity: 0,
                    y: move === "next" ? 50 : -50,
                  },
                  {
                    opacity: 1,
                    y: 0,
                    delay: 0.8 + itemIdx * 0.03,
                    duration: 0.6,
                    ease: "power3.out",
                  }
                );
              } else {
                gsap.to(el, {
                  opacity: 0,
                  y: -20,
                  delay: itemIdx * 0.03,
                  duration: 0.3,
                  ease: "power3.inOut",
                });
              }
            });
          }
        } else {
          tl.to(sec as HTMLElement, {
            y: window.innerHeight,
            ease: "expo.inOut",
            duration: duration / 1000,
            delay: idx * 0.1,
          });

          if (doms.length > 0) {
            doms.forEach((el) => {
              gsap.to(el, {
                opacity: 0,
                y: 50,
                delay: 0,
                duration: 0.4,
                ease: "power3.inOut",
              });
            });
          }
        }
      });
      gsap.delayedCall(duration / 1000 + 0.3, () => {
        scrollingRef.current = false;
      });
    },
    [duration]
  );

  const movePage = useCallback(
    (pageNum: number) => {
      setPage((prev) => {
        if (prev === pageNum) return prev;
        const dir: "next" | "prev" = pageNum > prev ? "next" : "prev";
        pageMoveHandler(pageNum, dir);
        return pageNum;
      });
    },
    [pageMoveHandler]
  );

  // 전체 페이지 랜더
  useLayoutEffect(() => {
    setPageCnt(pageRefs.current.length);
  }, []);

  const goToNextPage = useCallback(() => {
    if (scrollingRef.current) return;
    setPage((prevPage) => {
      if (!(pageRefs.current.length - 1 > prevPage)) return prevPage;
      const newPage = prevPage + 1;
      pageMoveHandler(newPage, "next");
      return newPage;
    });
  }, [pageMoveHandler]);

  const goToPrevPage = useCallback(() => {
    if (scrollingRef.current) return;
    setPage((prevPage) => {
      if (prevPage <= 0) return prevPage;
      const newPage = prevPage - 1;
      pageMoveHandler(newPage, "prev");
      return newPage;
    });
  }, [pageMoveHandler]);

  // Selector
  const scrollToSection = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const index = Number(el.dataset.page);
    pageRefs.current[index] = el;
  }, []);

  // Inital
  useLayoutEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", setVh);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", setVh);
    };
  }, []);

  // Resize 대응
  useLayoutEffect(() => {
    const setVh = () =>
      gsap.utils.toArray(pageRefs.current).forEach((sec, idx) => {
        const height = window.innerHeight;
        if (idx <= page) {
          gsap.set(sec as HTMLElement, { y: 0, height });
        } else {
          gsap.set(sec as HTMLElement, { y: window.innerHeight, height });
        }
      });

    window.addEventListener("resize", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
    };
  }, [page]);

  const innerContentsCalculator = useCallback((sec: HTMLDivElement) => {
    const viewSection = sec;

    if (!viewSection) return { isTop: false, isBottom: false };

    const { scrollHeight, clientHeight, scrollTop } = viewSection;

    // 내부 콘텐츠 크기 계산
    const isBottom =
      Math.ceil(clientHeight + scrollTop) >= Math.floor(scrollHeight);
    const isTop = scrollTop <= 0;

    return { isBottom, isTop };
  }, []);

  useEffect(() => {
    //move Handler

    // wheel Event
    const wheelEvent = (e: WheelEvent) => {
      //스크롤 상태 - 모멘텀 방지
      if (scrollingRef.current) {
        e.preventDefault();
        return;
      }

      const trigger = e.deltaY > 0 ? "next" : "prev";

      const { isTop, isBottom } = innerContentsCalculator(
        pageRefs.current[page] as HTMLDivElement
      );

      if (trigger === "prev" && !!isTop) {
        goToPrevPage();
      } else if (trigger === "next" && !!isBottom) {
        goToNextPage();
      }
    };

    // pc
    window.addEventListener("wheel", wheelEvent);

    /**
     * 모바일 터치 핸들러
     */
    const touchedStart = (e: TouchEvent) =>
      (touchedPosition.current = e.touches[0].clientY);

    const touchedCleaner = () => (touchedPosition.current = null);

    const touchedMove = (e: TouchEvent) => {
      if (scrollingRef.current) return;
      const dragClientY = e.touches[0].clientY;

      const TRIGGER_Y = 50;
      const deltaY = touchedPosition.current! - dragClientY;

      const { isTop, isBottom } = innerContentsCalculator(
        pageRefs.current[page] as HTMLDivElement
      );

      if (deltaY > TRIGGER_Y && !!isBottom) {
        goToNextPage();
      } else if (deltaY < -TRIGGER_Y && !!isTop) {
        goToPrevPage();
      }
    };

    //mobile
    window.addEventListener("touchstart", touchedStart);
    window.addEventListener("touchmove", touchedMove);
    window.addEventListener("touchend", touchedCleaner);

    return () => {
      window.removeEventListener("wheel", wheelEvent);

      //mobile
      window.removeEventListener("touchstart", touchedStart);
      window.removeEventListener("touchmove", touchedMove);
      window.removeEventListener("touchend", touchedCleaner);
    };
  }, [page, goToNextPage, goToPrevPage, innerContentsCalculator]);

  // inital ,
  useGSAP(
    () => {
      gsap.utils.toArray(pageRefs.current).forEach((e, idx) => {
        const sec = e as HTMLElement;
        //style 반영
        sec.classList.add("fp-section");

        if (idx <= page) {
          gsap.set(sec, { y: 0 });
        } else {
          gsap.set(sec, { y: window.innerHeight });
        }
      });
    },
    { scope: scope, dependencies: [pageRefs.current] }
  );

  return {
    scrollToSection,
    scope,
    curPage: page,
    movePage,
    pageCnt,
  };
};
