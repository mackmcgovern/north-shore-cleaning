export function validatePhone(phoneNumber: string) {
  // Define a regex pattern to match valid phone number characters
  const phonePattern = /^[0-9()+\-\s]+$/

  // Check if the phone number matches the pattern
  if (!phonePattern.test(phoneNumber)) {
    return false
  }

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')

  // Check if the cleaned number is between 10 and 15 digits
  return cleaned.length >= 7 && cleaned.length <= 11
}
