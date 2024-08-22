export const clearDefaultDragImage = (dataTransfer: DataTransfer) => {
  const image = document.createElement("Image");
  dataTransfer.setDragImage(image, 0, 0);
};
