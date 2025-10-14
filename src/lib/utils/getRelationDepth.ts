export const getRelationDepth = (array: string[], find: string) => {
  if (array.includes(find)) return 1;
  const prefix = `${find}-`;
  const match = array.find((p) => p.startsWith(prefix));
  if (!match) return 0;
  const d = parseInt(match.slice(prefix.length), 10);
  return Number.isFinite(d) && d > 0 ? d : 1;
};
