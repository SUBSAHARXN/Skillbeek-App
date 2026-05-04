import React from 'react';

const imgPersona1AikoTanaka = "https://i.pravatar.cc/150?img=1";
const imgPersona2KwameMensah = "https://i.pravatar.cc/150?img=11";
const imgPersona3IsabellaRossi = "https://i.pravatar.cc/150?img=5";
const imgPersona4LenaSchmidt = "https://i.pravatar.cc/150?img=9";
const imgPersona5DavidChen = "https://i.pravatar.cc/150?img=12";
const imgPersona6FinnOConnell = "https://i.pravatar.cc/150?img=13";
const imgPersona7MeiLin = "https://i.pravatar.cc/150?img=16";
const imgPersona8FatouToure = "https://i.pravatar.cc/150?img=19";
const imgPersona9SamuelAdebayo = "https://i.pravatar.cc/150?img=33";
const imgPersona10HanaSharma = "https://i.pravatar.cc/150?img=26";
const imgPersona11PierreDubois = "https://i.pravatar.cc/150?img=53";
const img12 = "https://i.pravatar.cc/150?img=60";

type PersonaPfpSetProps = {
  className?: string;
  persona?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12" | "13";
};

export function PersonaPfpSet({ className = "w-[56px] h-[56px]", persona = "01" }: PersonaPfpSetProps) {
  const is02 = persona === "02";
  const is03 = persona === "03";
  const is04 = persona === "04";
  const is05 = persona === "05";
  const is06 = persona === "06";
  const is07 = persona === "07";
  const is08 = persona === "08";
  const is09 = persona === "09";
  const is10 = persona === "10";
  const is11 = persona === "11";
  const is12 = persona === "12";
  const is13 = persona === "13";

  return (
    <div className={`relative ${className} overflow-hidden rounded-full shrink-0`}>
      {persona === "01" && (
        <img alt="Persona Aiko Tanaka" className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full" src={imgPersona1AikoTanaka} />
      )}
      {is02 && (
        <img alt="Persona Kwame Mensah" className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full" src={imgPersona2KwameMensah} />
      )}
      {is03 && (
        <img alt="Persona Isabella Rossi" className="absolute h-full left-[50%] -translate-x-[50%] max-w-none top-0 w-auto" src={imgPersona3IsabellaRossi} />
      )}
      {is04 && (
        <img alt="Persona Lena Schmidt" className="absolute h-full left-[50%] -translate-x-[50%] max-w-none top-0 w-auto" src={imgPersona4LenaSchmidt} />
      )}
      {is05 && (
        <img alt="Persona David Chen" className="absolute h-full left-[50%] -translate-x-[50%] max-w-none top-0 w-auto" src={imgPersona5DavidChen} />
      )}
      {is06 && (
        <img alt="Persona Finn O'Connell" className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full" src={imgPersona6FinnOConnell} />
      )}
      {is07 && (
        <img alt="Persona Mei Lin" className="absolute h-full left-[50%] -translate-x-[50%] max-w-none top-0 w-auto" src={imgPersona7MeiLin} />
      )}
      {is08 && (
        <img alt="Persona Fatou Touré" className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full" src={imgPersona8FatouToure} />
      )}
      {is09 && (
        <img alt="Persona Samuel Adebayo" className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full" src={imgPersona9SamuelAdebayo} />
      )}
      {is10 && (
        <img alt="Persona Hana Sharma" className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full" src={imgPersona10HanaSharma} />
      )}
      {is11 && (
        <img alt="Persona Pierre Dubois" className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full" src={imgPersona11PierreDubois} />
      )}
      {(is12 || is13) && (
        <img alt="Persona Diego Silva" className="absolute h-full left-[50%] -translate-x-[50%] max-w-none top-0 w-auto" src={img12} />
      )}
    </div>
  );
}
