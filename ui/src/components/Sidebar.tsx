import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white min-h-screen w-1/4 p-6">
      <h1 className="text-2xl font-bold mb-4">Fintech Project</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/create-account">
            <span className="text-blue-300 hover:text-blue-200">Create Account</span>
          </Link>
        </li>
        <li>
          <Link href="/find-account">
            <span className="text-blue-300 hover:text-blue-200">Find Account</span>
          </Link>
        </li>
        <li>
          <Link href="/deposit">
            <span className="text-blue-300 hover:text-blue-200">Deposit</span>
          </Link>
        </li>
        <li>
          <Link href="/withdraw">
            <span className="text-blue-300 hover:text-blue-200">Withdraw</span>
          </Link>
        </li>
        <li>
          <Link href="/check-balance">
            <span className="text-blue-300 hover:text-blue-200">Check Balance</span>
          </Link>
        </li>
        <li>
          <Link href="/transaction-history">
            <span className="text-blue-300 hover:text-blue-200">Transaction History</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
