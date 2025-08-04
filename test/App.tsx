import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./App.css";

function App() {
  const pageRefs = useRef<HTMLElement[]>([]);
  const scopeRefs = useRef<HTMLElement>(null);
  const scrollingRef = useRef<boolean>(false);
  const DURATIONS = 600;

  const touchedPosition = useRef<number>(null);

  // 현재 페이지
  const [page, setPage] = useState(0);

  // 높이갑 계싼 - 모바일 방지
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

  // ref 선택 - 랜더링에 의한 중복 방지하고
  const selectSec = useCallback((e: HTMLDivElement) => {
    if (e && !pageRefs.current.includes(e)) {
      pageRefs.current.push(e);
    }
  }, []);

  //page Move
  useEffect(() => {
    //move Handler
    const pageMoveHandler = (page: number, move: "next" | "prev") => {
      scrollingRef.current = true;

      gsap.utils.toArray(pageRefs.current).forEach((sec, idx) => {
        const tl = gsap.timeline();
        const doms = (sec as HTMLElement).querySelectorAll("[data-animate]");

        if (page >= idx) {
          tl.to(sec as HTMLElement, {
            y: 0,
            ease: "power3.inOut",
            duration: DURATIONS / 1000,
            delay: idx * 0.1,
          });

          // DOM Fade In Out
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
        } else {
          tl.to(sec as HTMLElement, {
            y: window.innerHeight,
            ease: "expo.inOut",
            duration: DURATIONS / 1000,
            delay: idx * 0.1,
          });

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
      });

      //Scroll 상태 풀기
      setTimeout(() => {
        scrollingRef.current = false;
      }, DURATIONS);
    };

    const goToNextPage = () => {
      if (!(pageRefs.current.length - 1 > page)) return;
      const movePage = page + 1;
      setPage(movePage);
      pageMoveHandler(movePage, "next");
    };

    const goToPrevPage = () => {
      if (page <= 0) return;
      const prevPage = page - 1;
      setPage(prevPage);
      pageMoveHandler(prevPage, "prev");
    };

    // wheel Event
    const wheelEvent = (e: WheelEvent) => {
      //스크롤 상태
      if (scrollingRef.current) return;

      const trigger = e.deltaY > 0 ? "next" : "prev";

      if (trigger === "prev") {
        goToPrevPage();
      } else if (trigger === "next") {
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

      if (deltaY > TRIGGER_Y) {
        goToNextPage();
      } else if (deltaY < -TRIGGER_Y) {
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
  }, [page]);

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
    { scope: scopeRefs, dependencies: [pageRefs.current] }
  );

  return (
    <main ref={scopeRefs}>
      <section style={{ backgroundColor: "gray" }} ref={selectSec}>
        <h1 data-animate>Frist</h1>

        <div style={{ display: "flex", gap: 5 }}>
          <div data-animate>item 1</div>
          <div data-animate>item 2</div>
          <div data-animate>item 3</div>
          <div data-animate>item 4</div>
        </div>
      </section>
      <section ref={selectSec}>
        <h1 data-animate>2</h1>

        <div style={{ display: "flex", gap: 5 }}>
          <div data-animate>item 1</div>
          <div data-animate>item 2</div>
          <div data-animate>item 3</div>
          <div data-animate>item 4</div>
        </div>
      </section>

      <section ref={selectSec}>
        <h1 data-animate>3</h1>

        <div data-animate>item 1</div>
        <div data-animate>item 2</div>
        <div data-animate>item 3</div>
      </section>
    </main>
  );
}

export default App;
