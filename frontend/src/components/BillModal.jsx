import { PrintButton } from "../components/PrintTest";

const BillModal = ({
  isOpen,
  setIsOpen,
  billId,
  foundCustomer,
  purchased,
  total,
  payment,
  discount,
  createdAt,
}) => {
  // console.log("modal", id);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0  z-50 bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white">
            <PrintButton
              createdAt={createdAt}
              billId={billId}
              foundCustomer={foundCustomer}
              purchased={purchased}
              setIsOpen={setIsOpen}
              total={total}
              payment={payment}
              discount={discount}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BillModal;
