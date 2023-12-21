import { PrintTransaction } from "./PrintTransaction";

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

export default TransactionModal;
