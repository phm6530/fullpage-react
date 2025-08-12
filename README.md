# useFullPage (GSAP 기반 풀페이지 훅)

한 섹션씩 스크롤/스와이프로 전환되는 React 훅입니다.  
FOUC 방지, 내부 스크롤 Top/Bottom 게이트, 모바일 터치, 리사이즈 대응 포함.

## 설치

```bash
npm i your-package-name gsap @gsap/react
```

# or

yarn add your-package-name gsap @gsap/react
Peer deps: gsap, @gsap/react

빠른 시작

1. 최소 CSS
   css
   복사
   편집
   /_ 섹션 공통 _/
   .fp-section {
   height: var(--vh, 100vh);
   overflow: auto; /_ 섹션 내부 스크롤 허용 _/
   will-change: transform;
   }

/_ FOUC 방지: 등장 대상 초기 숨김 (선택) _/
[data-animate] {
opacity: 0;
transform: translateY(16px);
} 2) 사용 예시 (Next.js / React)
tsx
복사
편집
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
style={{ display: "grid", placeItems: "center" }} >
<h1 data-animate>Section {i}</h1>
<p data-animate>현재 페이지: {curPage} / 총 {pageCnt - 1}</p>

            {/* 내부 스크롤 테스트 용도 */}
            <div style={{ height: 1200 }} />
          </section>
        ))}

        {/* 보조 네비게이션(선택) */}
        <nav style={{ position: "fixed", right: 16, bottom: 16, display: "grid", gap: 8 }}>
          <button onClick={() => movePage(Math.max(0, curPage - 1))}>Prev</button>
          <button onClick={() => movePage(Math.min(pageCnt - 1, curPage + 1))}>Next</button>
        </nav>
      </main>
    </GSAPProvider>

);
}
API
ts
복사
편집
type UseFullpagePropsType = {
duration?: number; // 전환 시간(ms), 기본 600
};

const {
scrollToSection, // (el: HTMLDivElement | null) => void : 섹션 등록
scope, // React ref : 섹션들을 감싸는 컨테이너 ref
curPage, // number : 현재 페이지 인덱스
movePage, // (pageNum: number) => void : 특정 페이지로 이동
pageCnt, // number : 섹션 개수
} = useFullPage({ duration });
마크업 규칙
각 섹션에 data-page(0부터 시작) 지정

섹션 DOM에 ref={scrollToSection} 연결

등장 애니메이션 대상에 data-animate 지정(선택)

tsx
복사
편집

<section data-page={0} ref={scrollToSection} className="fp-section">
  <h2 data-animate>Hero</h2>
</section>
동작 요약
휠/터치로 한 섹션씩 이동

섹션 내부 스크롤이 Top/Bottom일 때만 페이지 전환

리사이즈 시 --vh 갱신, body 스크롤 잠금 처리

data-animate 대상은 섹션 진입 시 페이드/슬라이드 인

Next.js 팁
App Router: 사용 컴포넌트 상단에 "use client"

전역 CSS에 .fp-section 및(선택) [data-animate] 초기 스타일 추가

GSAPProvider는 루트 레벨에서 한 번만 감싸도 됩니다

트러블슈팅
전환이 안 됨: 각 섹션에 data-page가 연속인지, ref={scrollToSection}가 호출되는지 확인

깜빡임(FOUC): [data-animate] 초기 숨김 CSS와 height: var(--vh)가 적용됐는지 확인

모바일 높이 문제: 브라우저 주소창 변화에 대비해 --vh를 내부에서 자동 갱신합니다

라이선스
MIT
