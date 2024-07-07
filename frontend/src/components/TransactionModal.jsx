import { PrintTransaction } from "./PrintTransaction";
import PropTypes from "prop-types";

const TransactionModal = ({
  name,
  amount,
  outstanding,
  paymentMode,
  setIsOpen,
  isOpen,
}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0  z-50 bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white">
            <PrintTransaction
              name={name}
              setIsOpen={setIsOpen}
              amount={amount}
              outstanding={outstanding}
              paymentMode={paymentMode}
            />
          </div>
        </div>
      )}
    </>
  );
};

TransactionModal.propTypes = {
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  outstanding: PropTypes.number.isRequired,
  paymentMode: PropTypes.string.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
export default TransactionModal;
