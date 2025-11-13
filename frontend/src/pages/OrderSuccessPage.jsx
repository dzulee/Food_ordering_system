import { Link,useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  return (
    <div className="container mt-5 text-center">
      <h2 className="text-success">✅ Payment Successful!</h2>
      <p>Your payment was processed successfully.</p>
      <p>Transaction ID: {token}</p>
     <Link to="/orders" className="btn btn-outline-primary mt-3"></Link>
    </div>
  );
};

export default PaymentSuccess;
