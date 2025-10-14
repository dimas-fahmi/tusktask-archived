export const getRelationDepth = (array: string[], find: string) => {
  const regex = new RegExp(`^${find}(-\\d+)?$`);
  const match = array.find((param) => regex.test(param));
  if (!match) return 0;

  const depth = match.split("-")[1];
  return depth ? Number(depth) : 1;
};
