import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

export default function LayersIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <mask
        id="a"
        width={24}
        height={24}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "alpha",
        }}
      >
        <path fill="#D9D9D9" d="M0 0h24v24H0z" />
      </mask>
      <g mask="url(#a)">
        <path d="M19.2 20.383 13.317 14.5c-.5.422-1.08.753-1.741.992a6.155 6.155 0 0 1-2.11.358c-1.807 0-3.336-.626-4.588-1.88C3.626 12.719 3 11.2 3 9.418c0-1.784.626-3.302 1.88-4.554 1.252-1.253 2.773-1.88 4.562-1.88 1.789 0 3.307.627 4.554 1.88 1.247 1.252 1.87 2.771 1.87 4.556a6.182 6.182 0 0 1-1.366 3.898l5.925 5.891c.161.156.238.35.23.584a.85.85 0 0 1-.859.833.794.794 0 0 1-.596-.242Zm-9.75-6.2c1.32 0 2.441-.465 3.365-1.396.923-.93 1.385-2.054 1.385-3.37 0-1.317-.462-2.44-1.385-3.371-.924-.93-2.046-1.396-3.365-1.396-1.329 0-2.458.465-3.388 1.396-.93.93-1.395 2.054-1.395 3.37 0 1.317.465 2.441 1.395 3.371.93.931 2.06 1.396 3.388 1.396Zm-1.725-3.95a.761.761 0 0 1-.575-.245.834.834 0 0 1-.233-.596c0-.234.08-.43.24-.588a.81.81 0 0 1 .593-.237h3.375c.228 0 .42.082.575.246a.834.834 0 0 1 .233.595c0 .234-.08.43-.24.588a.81.81 0 0 1-.593.237H7.725Z" />
      </g>
    </SvgIcon>
  );
}
