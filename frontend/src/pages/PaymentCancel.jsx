import { Link } from "react-router-dom";
const PaymentCancel = () => {
  return (
    <div className="container mt-5 text-center">
      <h2 className="text-danger">❌ Payment Cancelled</h2>
      <p>You cancelled the PayPal payment process.</p>
      <Link to="/checkout" className="btn btn-outline-primary mt-3 ms-2">Try Again</Link>
    </div>
  );
};

export default PaymentCancel;
