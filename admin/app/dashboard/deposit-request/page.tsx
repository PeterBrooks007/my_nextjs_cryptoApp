import DepositRequest from "@/screens/dashboard/DepositRequest";

const DepositRequestPage = () => {
  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Deposit Request</h1>
      </div>
      <DepositRequest />
    </div>
  );
};

export default DepositRequestPage;
