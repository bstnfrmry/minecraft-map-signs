import React from "react";

export type SignProps = {
  x: number;
  z: number;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
};

export const Sign: React.FC<SignProps> = ({ x, z, text1, text2, text3, text4 }) => {
  return (
    <div className="flex flex-col space-y-2">
      <h2 className="font-semibold">
        {x};{z}
      </h2>

      <div className="flex flex-col border-l-2 border-gray-300 pl-2 italic">
        <span>{text1}</span>
        <span>{text2}</span>
        <span>{text3}</span>
        <span>{text4}</span>
      </div>
    </div>
  );
};
