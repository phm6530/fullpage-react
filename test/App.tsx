import { useRef } from "react";
import "./App.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function App() {
  const refs = useRef<HTMLElement[]>([]);
  const scopeRefs = useRef<HTMLElement>(null);

  // Scope 선택 Hook,
  useGSAP(
    () => {
      gsap.utils.toArray(refs.current).forEach((e) => {
        console.log(e as HTMLElement);
      });
    },
    {
      scope: scopeRefs,
      dependencies: [],
    }
  );

  return (
    <main ref={scopeRefs}>
      <section
        className=""
        ref={(el) => {
          if (el) refs.current.push(el);
        }}
      ></section>
      <section
        className=""
        ref={(el) => {
          if (el) refs.current.push(el);
        }}
      ></section>
      <section
        className=""
        ref={(el) => {
          if (el) refs.current.push(el);
        }}
      ></section>
      <section
        className=""
        ref={(el) => {
          if (el) refs.current.push(el);
        }}
      ></section>
    </main>
  );
}

export default App;
