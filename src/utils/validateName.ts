export function validateName(name: string, minLength: number = 2): boolean {
  const nameRegex = /^[\p{L}\p{M} \-']+$/u
  return name.length >= minLength && nameRegex.test(name.trim())
}
