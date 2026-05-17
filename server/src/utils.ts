export const validationInput = (fields: Record<string, any>): string | null => {
  for (const key in fields) {
    if (!fields[key] || fields[key] === "") {
      return key;
    }
  }
  return null;
};
