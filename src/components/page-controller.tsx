export default function PageController({
  curPage,
  pageCnt,
}: {
  curPage: number;
  pageCnt: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  position?: string;
}) {
  return (
    <div className="fp-handler">
      {[...Array(pageCnt)].map((_, idx) => {
        return (
          <span
            key={`dot-${idx}]`}
            className={curPage === idx ? "active" : undefined}
            // {...(setPage && {
            //   onClick: () => {
            //     setPage(idx);
            //   },
            // })}
          />
        );
      })}
    </div>
  );
}
