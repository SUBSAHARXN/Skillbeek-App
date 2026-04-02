export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;

  const [localPart, domain] = email.split("@");

  if (localPart.length <= 2) {
    // If local part is very short, just mask the first character or leave it
    return `${localPart[0]}***@${domain}`;
  }

  // Mask after the second character replacing the rest of the local part with ***
  const visiblePart = localPart.substring(0, 2);
  return `${visiblePart}***@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return phone;
  // This is a generic formatter. In a real app, you might use a library like libphonenumber-js to parse the country code.
  // For the exact format requested: +234 90* *** **80
  
  // If the phone number is roughly international (e.g. +234 9012345680)
  // Let's strip spaces/dashes first
  const clean = phone.replace(/[\s-]/g, "");
  
  if (clean.length >= 10) {
    const countryCode = clean.substring(0, clean.length - 10); // Everything before the last 10 digits
    const networkAndPrefix = clean.substring(clean.length - 10, clean.length - 8); // Next 2 digits (e.g. 90)
    const lastTwo = clean.substring(clean.length - 2); // Last 2 digits (e.g. 80)
    
    return `${countryCode} ${networkAndPrefix}* *** **${lastTwo}`;
  }
  
  return phone; // Fallback if format is not recognizable
}
