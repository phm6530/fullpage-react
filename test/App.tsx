import "./App.css";
import { useFullPage } from "../src";
import PageController from "../src/components/page-controller";

function App() {
  // use Full page..
  const { scrollToSection, scope, movePage, ...rest } = useFullPage();

  //page Move
  return (
    <main ref={scope}>
      <section
        style={{ backgroundColor: "gray" }}
        ref={scrollToSection}
        data-page={0}
      >
        <div>
          <h1 data-animate>Frist</h1>
          <div style={{ display: "flex", gap: 5 }}>
            <div data-animate style={{ height: "1500px", background: "red" }}>
              item 1<button onClick={() => movePage(2)}>btn</button>
            </div>
            <div data-animate style={{ height: "1000px" }}>
              item 2
            </div>
            <div data-animate style={{ height: "1000px" }}>
              item 3
            </div>
            <div data-animate style={{ height: "1000px" }}>
              item 4
            </div>
          </div>
        </div>
      </section>

      <section
        ref={scrollToSection}
        data-page={1}
        style={{ background: "#666666" }}
      >
        <div>
          <h1 data-animate>2</h1>
          <div style={{ display: "flex", gap: 5 }}>
            <div data-animate style={{ height: "1500px", background: "red" }}>
              item 1
            </div>
            <div data-animate style={{ height: "1000px" }}>
              item 2
            </div>
            <div data-animate style={{ height: "1000px" }}>
              item 3
            </div>
            <div data-animate style={{ height: "1000px" }}>
              item 4
            </div>
          </div>
        </div>
      </section>

      <section
        ref={scrollToSection}
        data-page={2}
        style={{ background: "#000000" }}
      >
        <h1 data-animate>3</h1>
        <div data-animate>item 1</div>
        <div data-animate>item 2</div>
        <div data-animate>item 3</div>
      </section>

      {/* 제공 컨트롤러 */}
      <PageController {...rest} pageHandler={movePage} />
    </main>
  );
}

export default App;
