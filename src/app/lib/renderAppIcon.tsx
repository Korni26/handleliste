import { ImageResponse } from "next/og";

// A simplified shopping-bag mark matching Handleliste's existing branding.
export function renderAppIcon(pixelSize: number): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#2F7A57",
        }}
      >
        <svg
          width={Math.round(pixelSize * 0.7)}
          height={Math.round(pixelSize * 0.7)}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M43 51V38c0-14 7-23 17-23s17 9 17 23v13"
            stroke="#FFFFFF"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path d="M29 48h62l-5 56H34l-5-56Z" fill="#FFFFFF" />
          <path
            d="m46 76 10 10 20-22"
            stroke="#2F7A57"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { width: pixelSize, height: pixelSize }
  );
}
