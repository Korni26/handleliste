import { renderAppIcon } from "./lib/renderAppIcon";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon192() {
  return renderAppIcon(size.width);
}
