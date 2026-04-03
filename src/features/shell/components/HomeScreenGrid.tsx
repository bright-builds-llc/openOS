import type { ShellProfile } from "../profile/createShellProfile";

type HomeScreenGridProps = {
  profile: ShellProfile;
};

const previewIcons = [
  "Calendar",
  "Photos",
  "Camera",
  "Weather",
  "Clock",
  "Maps",
  "Notes",
  "Health",
  "Settings",
  "Music",
  "Mail",
  "Files",
];

export function HomeScreenGrid({ profile }: HomeScreenGridProps) {
  return (
    <div className="shell-grid" data-profile={profile.kind}>
      {previewIcons.map((label) => (
        <div className="shell-grid__item" key={label}>
          <div className="shell-grid__icon" />
          <div className="shell-grid__label">{label}</div>
        </div>
      ))}
    </div>
  );
}
