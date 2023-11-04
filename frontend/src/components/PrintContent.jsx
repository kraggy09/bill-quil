import React from "react";

import Barcode from "react-barcode";
const PrintContent = () => {
  return (
    <div>
      {Array(15)
        .fill("")
        .map((index) => {
          return (
            <Barcode
              value={89080758912}
              key={index}
              height={30}
              fontSize={12}
            />
          );
        })}
    </div>
  );
};

export default PrintContent;
