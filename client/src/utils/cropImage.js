import * as ImageManipulator from "expo-image-manipulator";

export const getCroppedImg = async (imageSrc, crop) => {
  try {
    if (!imageSrc || !crop?.width || !crop?.height) {
      console.log("Invalid crop input");
      return null;
    }

    const result = await ImageManipulator.manipulateAsync(
      imageSrc,
      [
        {
          crop: {
            originX: Math.max(0, Math.round(crop.x)),
            originY: Math.max(0, Math.round(crop.y)),
            width: Math.round(crop.width),
            height: Math.round(crop.height),
          },
        },
      ],
      {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    console.log("CROP RESULT:", result);

    return result.uri;
  } catch (e) {
    console.log("CROP ERROR:", e);
    return null;
  }
};