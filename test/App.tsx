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
    const pageMoveHandler = (arrow: "top" | "bottom") => {
      scrollingRef.current = true;

      if (arrow === "top" && page > 0) {
        setPage((prev) => prev - 1);
      } else if (arrow === "bottom" && pageRefs.current.length - 1 > page) {
        setPage((prev) => prev + 1);
      }
    };

    // wheel Event
    const wheelEvent = (e: WheelEvent) => {
      const trigger = e.deltaY > 0 ? "bottom" : "top";
      if (scrollingRef.current) return;

      //handler
      pageMoveHandler(trigger);

      //Scroll 상태 풀기
      setTimeout(() => {
        scrollingRef.current = false;
      }, DURATIONS);
    };

    window.addEventListener("wheel", wheelEvent);
    return () => {
      window.removeEventListener("wheel", wheelEvent);
    };
  }, [page]);

  // Animation
  useGSAP(
    () => {
      gsap.utils.toArray(pageRefs.current).forEach((sec, idx) => {
        if (idx <= page) {
          gsap.to(sec as HTMLElement, {
            y: 0,
            duration: DURATIONS / 1000,
          });
        } else {
          gsap.to(sec as HTMLElement, { y: window.innerHeight });
        }
      });
    },
    { dependencies: [page] }
  );

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
        <h1>Frist</h1>
      </section>
      <section ref={selectSec}>
        <h1>2</h1>
      </section>
    </main>
  );
}

export default App;
