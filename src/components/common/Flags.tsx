import React from "react";

type FlagsProps = {
  /**
   * 2-letter ISO country code (e.g., 'ng' for Nigeria, 'us' for United States)
   */
  countryCode?: string;
  className?: string;
};

const getTwemojiUrl = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => (127397 + char.charCodeAt(0)).toString(16))
    .join('-');
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codePoints}.svg`;
};

/**
 * Renders a country flag using Twemoji SVGs.
 * This ensures flags render correctly as waving icons across all operating systems,
 * including Windows which does not natively support country flag emojis.
 */
export const Flags = ({ countryCode = "ng", className = "" }: FlagsProps) => {
  const url = getTwemojiUrl(countryCode);
  
  return (
    <img
      src={url}
      alt={`${countryCode} flag`}
      className={`object-contain ${className}`}
      style={{ width: '24px', height: '24px' }}
    />
  );
};
