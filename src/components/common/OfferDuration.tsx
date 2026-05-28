import { ClockIcon, TimeCreditIcon } from "./Icons";

type OfferDurationProps = {
  duration?: string;
  label?: string;
  price?: number | string;
  isTimeCredit?: boolean;
};

export const OfferDuration = ({
  duration = "90 minutes",
  label = "Session length",
  price = 234,
  isTimeCredit = price !== undefined && price !== null && price !== 0 && price !== "",
}: OfferDurationProps): JSX.Element => {
  return (
    <section
      aria-label="Offer duration and price"
      className="relative flex w-full items-center justify-between rounded-xl bg-[#f8efff] px-3 py-4"
    >
      <div className="relative flex flex-1 min-w-0 items-center gap-3">
        <div
          aria-hidden="true"
          className="relative inline-flex flex-[0_0_auto] items-center gap-[5.45px] rounded-[4.36px] bg-[#eacfff] p-[5.45px]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="!relative !h-4 !w-4">
            <g clipPath="url(#clip0_3785_16913)">
              <path d="M8 1V3" stroke="#5F0193" strokeWidth="1.33333" strokeMiterlimit="10"/>
              <path d="M15 8H13" stroke="#5F0193" strokeWidth="1.33333" strokeMiterlimit="10"/>
              <path d="M8 15V13" stroke="#5F0193" strokeWidth="1.33333" strokeMiterlimit="10"/>
              <path d="M1 8H3" stroke="#5F0193" strokeWidth="1.33333" strokeMiterlimit="10"/>
              <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" stroke="#5F0193" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="square"/>
              <path d="M5 4L8 8H11" stroke="#5F0193" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="square"/>
            </g>
            <defs>
              <clipPath id="clip0_3785_16913">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="relative flex flex-1 min-w-0 flex-col items-start">
          <p className="relative mt-[-1.00px] self-stretch [font-family:'Nunito-Bold',Helvetica] text-base font-bold leading-6 tracking-[1.00px] text-[#171519] truncate w-full">
            {duration}
          </p>
          <p className="relative self-stretch [font-family:'Nunito-SemiBold',Helvetica] text-xs font-semibold leading-4 tracking-[1.10px] text-[#656268] truncate w-full">
            {label}
          </p>
        </div>
      </div>
      {isTimeCredit && (
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <div
            className="w-[2px] h-11 relative rounded-full shrink-0"
            style={{
              backgroundColor: "var(--Mapped-Button-UI-comp-sur-Stroke, var(--mapped-button-ui-comp-sur-stroke, #eacfff))",
              boxShadow: "inset 1px 1px 4px rgba(192, 188, 195, 0.5), inset -1px -1px 4px rgba(255, 255, 255, 0.9)"
            }}
            aria-hidden="true"
          />
          <div
            aria-label={`Price ${price}`}
            className="relative inline-flex flex-[0_0_auto] items-center gap-1.5"
          >
            <TimeCreditIcon className="w-6 h-6 text-[#171519]" aria-hidden="true" />
            <div className="relative mt-[-1.00px] flex w-fit items-center whitespace-nowrap [font-family:'Nunito-Bold',Helvetica] text-xl font-bold leading-7 tracking-[-0.20px] text-[#171519]">
              {price}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OfferDuration;
