export function validateInput(string: string, minLength: number = 2): boolean {
  return string.trim().length >= minLength
}
