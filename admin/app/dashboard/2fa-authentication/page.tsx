import TwofaAuthentication from "@/screens/dashboard/2faAuthentication";

const TwofaAuthenticationPage = () => {
  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">2fa Authentication</h1>
      </div>
      <TwofaAuthentication />
    </div>
  );
};

export default TwofaAuthenticationPage;
