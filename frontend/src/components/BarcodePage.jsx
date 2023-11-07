import { useParams } from "react-router-dom";
import { useState } from "react";
import Barcode from "react-barcode";

const BarcodePage = () => {
  const params = useParams();
  const { id } = params;
  console.log(params);
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      It is the barcode page of {params.id}
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          setQuantity(e.target.value);
        }}
      />
      <div className="flex max-w-[1400px] flex-wrap">
        {Array(Number(quantity))
          .fill("")
          .map((_, index) => {
            return (
              <Barcode
                key={index}
                width={2}
                value={id}
                height={30}
                fontSize={12}
              />
            );
          })}
      </div>
    </div>
  );
};

export default BarcodePage;
