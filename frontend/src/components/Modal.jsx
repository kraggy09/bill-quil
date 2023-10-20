import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
const Modal = ({ isOpen, setIsOpen, Component, componentProps }) => {
  const navigate = useNavigate();
  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-md">
          <div className="modal-container bg-white p-8 rounded-lg shadow-lg">
            <Component {...componentProps} setIsOpen={setIsOpen} />
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/dashboard");
              }}
              className="bg-gray-400 hover-bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  Component: PropTypes.elementType.isRequired,
  componentProps: PropTypes.object,
};
export default Modal;
