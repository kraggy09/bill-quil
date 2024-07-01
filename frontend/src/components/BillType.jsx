import PropTypes from "prop-types";
import { useEffect } from "react";

const BillType = ({ billType, setBillType, setIsOpen }) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "s") {
        const linkButton = document.getElementById("super-wholesale");
        if (linkButton) {
          linkButton.click();
        }
      } else if (event.key == "w") {
        const linkButton = document.getElementById("wholesale");
        if (linkButton) {
          linkButton.click();
        }
      } else if (event.key == "r") {
        const linkButton = document.getElementById("retail");
        if (linkButton) {
          linkButton.click();
        }
      } else {
        console.log("Please press correct button");
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <>
      <h1 className="text-center text-4xl font-bold p-5 rounded-xl bg-green-500 text-white">
        Select Bill Type
      </h1>
      <div className="min-w-[30vw] flex items-center justify-center min-h-[40vh] ">
        <span
          id="super-wholesale"
          onClick={() => {
            setBillType("superWholesale");
            setIsOpen(false);
          }}
          className="text-3xl font-bold mx-16 p-8 border rounded-xl hover:cursor-pointer hover:border-green-500 transition-all duration-300 ease-linear hover:bg-green-500 hover:text-white
      "
        >
          Super WholeSale
        </span>
        <span
          id="wholesale"
          onClick={() => {
            setBillType("wholesale");
            setIsOpen(false);
          }}
          className="text-3xl font-bold mx-16 p-8 border rounded-xl hover:cursor-pointer hover:border-green-500 transition-all duration-300 ease-linear hover:bg-green-500 hover:text-white
      "
        >
          WholeSale
        </span>
        <span
          id="retail"
          onClick={() => {
            setBillType("retail");
            setIsOpen(false);
          }}
          className="text-3xl font-bold mx-16 p-8 border rounded-xl hover:cursor-pointer hover:border-green-500 transition-all duration-300 ease-linear hover:bg-green-500 hover:text-white
      "
        >
          Retail
        </span>
      </div>
    </>
  );
};

BillType.propTypes = {
  billType: PropTypes.string,
  setIsOpen: PropTypes.func.isRequired,
  setBillType: PropTypes.func.isRequired,
};

export default BillType;
