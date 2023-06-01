const fetchClient = (endpoint, config) =>
	fetch([process.env.CLOUDFLARE_API_URL, endpoint].join("/"), {
		...config,
		headers: {
			Authorization: "Bearer " + process.env.CLOUDFLARE_API_TOKEN,
			...config.headers,
		},
	}).then((res) => res.json());

const toBuffer = (arrayBuffer) => {
	const buffer = Buffer.alloc(arrayBuffer.byteLength);
	const view = new Uint8Array(arrayBuffer);
	for (let i = 0; i < buffer.length; ++i) {
		buffer[i] = view[i];
	}
	return buffer;
};

const cloudflare = {
	getDirectUploadURL: async () =>
		fetchClient("direct_upload", {
			method: "POST",
		}).then((res) => res),
	uploadImage: async ({ url, blob, filename }) => {
		const formData = new FormData();
		formData.append("file", blob, filename);

		const res = await fetch(url, {
			method: "POST",
			body: formData,
		});

		const json = await res.json();

		return json;
	},
};

module.exports = {
	cloudflare,
	toBuffer,
};
