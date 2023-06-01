require("dotenv").config();

const fs = require("fs");
const { join } = require("path");

const { upscaleImage } = require("./client.js");
const { cloudflare, toBuffer } = require("./cloudflare.js");
const sharp = require("sharp");

const main = async (paths) => {
	for (const path of paths) {
		const {
			result: { uploadURL },
		} = await cloudflare.getDirectUploadURL();

		const blob = fs.readFileSync(path);
		const filename = path.split("\\").pop();
		const folder = path.split("\\")[path.split("\\").length - 2];

		const {
			result: {
				variants: [image],
			},
		} = await cloudflare.uploadImage({
			url: uploadURL,
			blob: new Blob([blob]),
			filename,
		});

		const upscaledImageUrl = await upscaleImage({ image });

		const response = await fetch(upscaledImageUrl);
		const buffer = toBuffer(await response.arrayBuffer());

		const upscaledFilePath = join(process.cwd(), "upscaled", "8k", folder, filename);

		sharp(buffer)
			.resize(7680, 4320)
			.png({
				compressionLevel: 9,
				quality: 95,
			})
			.toFile(upscaledFilePath);
	}
};

const imageFolders = fs.readdirSync(join(process.cwd(), "images"));
const upscaledFolders = fs.readdirSync(join(process.cwd(), "upscaled", "8k"));

const upscaledImages = upscaledFolders.reduce((acc, folder) => {
	const folderImages = fs.readdirSync(join(process.cwd(), "upscaled", "8k", folder));
	const paths = [];

	for (const image of folderImages) {
		paths.push(join(folder, image));
	}

	return [...acc, ...paths];
}, []);

const paths = imageFolders
	.reduce((acc, folder) => {
		const folderImages = fs.readdirSync(join(process.cwd(), "images", folder));
		const paths = [];

		for (const image of folderImages) {
			paths.push(join(process.cwd(), "images", folder, image));
		}

		return [...acc, ...paths];
	}, [])
	.filter((path) => !upscaledImages.some((image) => path.includes(image)));

main(paths);
