import Card from "./Cards";
import { ToggleRight } from "lucide-react";

type StatsSummaryProps = {
  counts: {
    total: number;
    implemented: number;
    notImplemented: number;
    notApplicable: number;
  };
};

const StatsSummary = ({ counts }: StatsSummaryProps) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <Card>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center shrink-0">
            <ToggleRight size={24} color="white" />
          </div>
          <div>
            <h3 className="text-sm text-gray-600 font-medium">
              Total Controls
            </h3>
            <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm text-gray-600 font-medium">Implemented</h3>
        <p className="text-2xl font-bold text-green-600">
          {counts.implemented}
        </p>
      </Card>

      <Card>
        <h3 className="text-sm text-gray-600 font-medium">Not Implemented</h3>
        <p className="text-2xl font-bold text-rose-600">
          {counts.notImplemented}
        </p>
      </Card>

      <Card>
        <h3 className="text-sm text-gray-600 font-medium">Not Applicable</h3>
        <p className="text-2xl font-bold text-orange-500">
          {counts.notApplicable}
        </p>
      </Card>
    </div>
  );
};

export default StatsSummary;
