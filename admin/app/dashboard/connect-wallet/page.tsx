import ConnectWallet from "@/screens/dashboard/ConnectWallet";

const ConnectWalletPage = () => {
  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Connect Wallets</h1>
      </div>
      <ConnectWallet />
    </div>
  );
};

export default ConnectWalletPage;
