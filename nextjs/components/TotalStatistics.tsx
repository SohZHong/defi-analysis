import { User } from "@/utils/getRequestData";
import { ethers } from "ethers";

interface StatisticsProps {
  user: User;
}

export default function TotalStatistics({ user }: StatisticsProps) {
  return (
    <div className="">
      <h2 className="text-xl lg:my-4 my-2">
        <span className="font-semibold brightness-50">ID:</span>{" "}
        <span className="font-bold truncate">{user.id}</span>
      </h2>
      <div className="grid lg:grid-cols-3 lg:grid-rows-2 grid-cols-2 grid-rows-3 lg:gap-4 gap-2">
        <div className="flex flex-col">
          <span className="font-semibold brightness-50">Total Supplied:</span>
          <span className="text-xl font-bold overflow-hidden text-ellipsis">
            {ethers.formatEther(BigInt(user.totalSupplied))}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold brightness-50">Total Borrowed:</span>
          <span className="text-xl font-bold overflow-hidden text-ellipsis">
            {ethers.formatEther(BigInt(user.totalBorrowed))}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold brightness-50">Total Repaid:</span>
          <span className="text-xl font-bold overflow-hidden text-ellipsis">
            {ethers.formatEther(BigInt(user.totalRepaid))}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold brightness-50">Total Liquidated:</span>
          <span className="text-xl font-bold overflow-hidden text-ellipsis">
            {ethers.formatEther(BigInt(user.totalLiquidated))}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold brightness-50">Total Withdrawn:</span>
          <span className="text-xl font-bold overflow-hidden text-ellipsis">
            {ethers.formatEther(BigInt(user.totalWithdrawn))}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold brightness-50">Flash Loan Count:</span>
          <span className="text-xl font-bold overflow-hidden text-ellipsis">
            {user.flashLoanCount}
          </span>
        </div>
      </div>
    </div>
  );
}
