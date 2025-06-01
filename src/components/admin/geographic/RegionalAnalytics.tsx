
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RegionalAnalytics = () => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Regional Performance Analytics</CardTitle>
        <CardDescription>Growth trends and performance metrics by region</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Top Performing Region</h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🇹🇿</span>
              <div>
                <div className="font-bold">Tanzania</div>
                <div className="text-sm text-blue-600">856 ambassadors • 85% growth</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Fastest Growing</h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🇰🇪</span>
              <div>
                <div className="font-bold">Kenya</div>
                <div className="text-sm text-green-600">45 ambassadors • 120% growth</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">Needs Attention</h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🇧🇮</span>
              <div>
                <div className="font-bold">Burundi</div>
                <div className="text-sm text-yellow-600">8 ambassadors • 15% growth</div>
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalAnalytics;
