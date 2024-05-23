export const validateEnvVar = (
  variable: string | undefined,
  variableName: string
): string => {
  if (!variable) {
    throw new Error(`Environment variable ${variableName} is not defined`);
  }
  return variable;
};
