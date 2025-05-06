
import React from "react";
import FinanceOverview from "@/components/FinanceOverview";

const Finance = () => {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Financial Summary</h1>
      <FinanceOverview />
    </div>
  );
};

export default Finance;
