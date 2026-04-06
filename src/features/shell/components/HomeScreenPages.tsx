import type { HomeScreenPage } from "../data/homeScreenIcons";
import type { MotionRect } from "../../motion/homeNavigationMotion";
import type { ShellProfile } from "../profile/createShellProfile";
import { HomeScreenGrid } from "./HomeScreenGrid";

type HomeScreenPagesProps = {
  activePage: number;
  onChangePage: (nextPage: number) => void;
  onOpenApp: (appId: string, originRect: MotionRect | null) => void;
  pages: HomeScreenPage[];
  profile: ShellProfile;
};

export function HomeScreenPages({
  activePage,
  onChangePage,
  onOpenApp,
  pages,
  profile,
}: HomeScreenPagesProps) {
  const pageCount = pages.length;

  return (
    <div
      aria-label="Home screen pages"
      className="shell-pages"
      data-active-page={activePage}
      data-page-count={pageCount}
    >
      <div className="shell-pages__viewport">
        <div
          className="shell-pages__track"
          style={{
            transform: `translateX(-${activePage * 100}%)`,
          }}
        >
          {pages.map((page) => (
            <div
              className="shell-pages__page"
              data-page-index={page.index}
              key={page.index}
            >
              <HomeScreenGrid
                apps={page.apps}
                onOpenApp={onOpenApp}
                profile={profile}
              />
            </div>
          ))}
        </div>
      </div>
      {pageCount > 1 ? (
        <div className="shell-pages__indicators" role="tablist">
          {pages.map((page) => {
            const isActive = page.index === activePage;

            return (
              <button
                aria-label={`Go to home screen page ${page.index + 1}`}
                aria-selected={isActive}
                className="shell-pages__indicator"
                data-active={isActive ? "true" : "false"}
                key={page.index}
                onClick={() => {
                  onChangePage(page.index);
                }}
                role="tab"
                type="button"
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
