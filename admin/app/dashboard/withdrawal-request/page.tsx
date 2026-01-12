import WithdrawalRequest from "@/screens/dashboard/WithdrawalRequest";

const WithdrawalRequestPage = () => {
  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Withdrawal Request</h1>
      </div>
      <WithdrawalRequest />
    </div>
  );
};

export default WithdrawalRequestPage;
