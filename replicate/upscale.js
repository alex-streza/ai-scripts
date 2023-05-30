// upscale all images from /images folders using import
import { fs } from "fs";
import { join } from "path";

import { upscaleImage } from "./client.js";

// convert image to base 64 string

const images = fs.readdirSync(
  join(process.cwd(), "images", {
    encoding: "base64",
  })
);

for (const image of images) {
  const result = await upscaleImage({ image });

  fs.writeFileSync(join(process.cwd(), "images", image), result.output.image, {
    encoding: "base64",
  });
}
