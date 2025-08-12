# useFullPage (GSAP 기반 풀페이지 훅)

한 섹션씩 스크롤/스와이프로 전환되는 React 훅입니다.  
FOUC 방지, 내부 스크롤 Top/Bottom 게이트, 모바일 터치, 리사이즈 대응 포함.

[![npm version](https://img.shields.io/npm/v/your-package-name.svg)](https://www.npmjs.com/package/your-package-name)
[![license](https://img.shields.io/npm/l/your-package-name.svg)](LICENSE)

---

## 설치

```bash
npm i your-package-name gsap @gsap/react
# 또는
yarn add your-package-name gsap @gsap/react
```


# 빠른시작
- 기본 CSS
```bash
[data-page] {
  height: calc(var(--vh, 1vh));
  width: 100%;
  position: absolute;
  top: 0;
  overflow-y: auto;
  width: 100%;
}

.fp-handler {
  display: flex;
  gap: 5px;
  flex-direction: column;
  position: fixed;
  z-index: 10;
  right: 30px;
  transform: translateY(-50%);
  top: 50%;
}

.fp-handler span {
  width: 11px;
  height: 11px;
  background: rgba(255, 0, 0, 0.223);
  border-radius: 100%;

  &.active {
    background-color: rgb(255, 255, 255);
  }
}
```


- 사용예시 ( Readt , Next )
  
```bash
"use client";

import React from "react";
import { useFullPage } from "your-package-name";
import { GSAPProvider } from "@gsap/react";

export default function Demo() {
  const { scope, scrollToSection, curPage, movePage, pageCnt } = useFullPage({ duration: 600 });

  return (
    <GSAPProvider>
      <main ref={scope}>
        {[0, 1, 2].map((i) => (
          <section
            key={i}
            data-page={i}
            ref={scrollToSection}
            className="fp-section"
            style={{ display: "grid", placeItems: "center" }}
          >
            <h1 data-animate>Section {i}</h1>
            <p data-animate>
              현재 페이지: {curPage} / 총 {pageCnt - 1}
            </p>

            {/* 내부 스크롤 테스트 */}
            <div style={{ height: 1200 }} />
          </section>
        ))}

        {/* 보조 네비게이션 */}
        <nav style={{ position: "fixed", right: 16, bottom: 16, display: "grid", gap: 8 }}>
          <button onClick={() => movePage(Math.max(0, curPage - 1))}>Prev</button>
          <button onClick={() => movePage(Math.min(pageCnt - 1, curPage + 1))}>Next</button>
        </nav>
      </main>
    </GSAPProvider>
  );
}

```


# Api 
```bash
type UseFullpagePropsType = {
  duration?: number; // 전환 시간(ms), 기본 600
};

const {
  scrollToSection, // (el: HTMLDivElement | null) => void : 섹션 등록
  scope,           // React ref : 섹션 컨테이너 ref
  curPage,         // number : 현재 페이지 인덱스
  movePage,        // (pageNum: number) => void : 특정 페이지로 이동
  pageCnt,         // number : 섹션 개수
} = useFullPage({ duration });
```

# 마크업 규칙
- 각 섹션 dage-page 0 부터 순서 필수 반영
- React, Next 환경에 맞춰 개발된 라이브러리로 ref , scrollToSection 연결
- 내부 DOM 콘텐츠의경우 data-animate 지정하여 Fade In Fade Out 애니메이션 반영 



# 트러블슈팅
- next - App Router 환경에선 "use client" 에서 실행해야 하며, 초기 CSS 사전랜더가 불가함에 따라 FOCU 현상을 [data-page] CSS 선택자를 통해 개선
- 모바일은 View Port- innerHieght 기준으로 가변적인 높이 값 개선

