export default function PageController({
  curPage,
  pageCnt,
  pageHandler,
}: {
  curPage: number;
  pageCnt: number;
  pageHandler?: (page: number) => void;
  position?: string;
}) {
  return (
    <div className="fp-handler">
      {[...Array(pageCnt)].map((_, idx) => {
        return (
          <span
            key={`dot-${idx}]`}
            className={curPage === idx ? "active" : undefined}
            {...(!!pageHandler && { onClick: () => pageHandler(idx) })}
          />
        );
      })}
    </div>
  );
}
