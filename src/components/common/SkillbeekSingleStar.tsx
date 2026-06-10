import React from 'react';

interface SkillbeekSingleStarProps {
  rating?: number;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export const SkillbeekSingleStar = ({ 
  rating = 0, 
  className = "", 
  iconClassName = "w-[24px] h-[24px]",
  textClassName = "font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[14px] leading-[20px] tracking-[1px]"
}: SkillbeekSingleStarProps) => {
  // 1. Calculate the percentage (e.g., 4.2 out of 5.0 = 84%)
  // Math.min/max ensures the value never breaks outside of 0-100%
  const fillPercentage = Math.max(0, Math.min(100, (rating / 5) * 100));

  // 2. Create a unique ID for the gradient. 
  // (Crucial if you have multiple different ratings rendered on the same page!)
  const gradientId = `star-grad-${rating.toString().replace('.', '-')}`;

  return (
    <div className={`inline-flex items-center gap-[4px] ${className}`}>
      
      {/* The Single SVG Element */}
      <svg className={iconClassName} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {/* The Filled Part (Skillbeek Gold - adapted to project's b7812f) */}
            <stop offset={`${fillPercentage}%`} stopColor="#b7812f" />
            
            {/* The Unfilled Part (Skillbeek Grey) */}
            {/* By setting this stop at the exact same percentage, it creates a hard mathematical line instead of a blurry fade */}
            <stop offset={`${fillPercentage}%`} stopColor="#c0bcc3" />
          </linearGradient>
        </defs>
        
        {/* A standard 5-point star path pointing to our dynamic gradient */}
        <path 
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" 
          fill={`url(#${gradientId})`} 
        />
      </svg>
      
      {/* The numeric text (e.g., "4.2") */}
      <span className={textClassName}>
        {rating.toFixed(1)}
      </span>

    </div>
  );
};
