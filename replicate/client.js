import Replicate from "replicate";

export const replicate = new Replicate({
  // get your token from https://replicate.com/account
  auth: process.env.REPLICATE_API_TOKEN,
});

export const upscaleImage = async ({ image }) => {
  const { prediction } = await replicate.run(
    "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
    {
      input: {
        image,
        scale: 4,
      },
    }
  );

  return prediction;
};
