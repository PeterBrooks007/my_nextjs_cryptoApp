import Mailbox from "@/screens/dashboard/Mailbox";

const MailboxPage = () => {
  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Mailbox</h1>
      </div>
      <Mailbox />
    </div>
  );
};

export default MailboxPage;
