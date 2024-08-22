export const toMap = <T extends { id: string }>(objectsWithId: T[]) => {
  return objectsWithId.reduce(
    (acc, object) => {
      acc[object.id] = object;
      return acc;
    },
    {} as Record<string, T>,
  );
};
