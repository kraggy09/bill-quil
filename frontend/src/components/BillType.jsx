import PropTypes from "prop-types";

const BillType = ({ billType, setBillType, setIsOpen }) => {
  return (
    <>
      <h1 className="text-center text-4xl font-bold p-5 rounded-xl bg-green-500 text-white">
        Select Bill Type
      </h1>
      <div className="min-w-[30vw] flex items-center justify-center min-h-[40vh] ">
        <span
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
