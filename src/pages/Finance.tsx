
import { useState } from "react";
import FinanceOverview from "@/components/FinanceOverview";

const Finance = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Financial Summary</h1>
      <FinanceOverview />
    </div>
  );
};

export default Finance;
