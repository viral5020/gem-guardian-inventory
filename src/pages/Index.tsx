
import Dashboard from "@/components/Dashboard";

const Index = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Dashboard onSelectDiamond={(id) => window.location.href = `/inventory`} />
    </div>
  );
};

export default Index;
