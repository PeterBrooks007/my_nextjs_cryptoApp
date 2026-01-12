import AllUsersTable from "@/components/AllUsersTable";

const UsersPage = async () => {
  return (
    <div className="">
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>

      <AllUsersTable />
    </div>
  );
};

export default UsersPage;
