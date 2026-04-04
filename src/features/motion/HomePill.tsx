type HomePillProps = {
  onHome: () => void;
};

export function HomePill({ onHome }: HomePillProps) {
  return (
    <button
      aria-label="Return to home screen"
      className="home-pill"
      onClick={onHome}
      type="button"
    >
      <span className="home-pill__inner" />
    </button>
  );
}
