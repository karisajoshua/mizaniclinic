
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

const EarningsBreakdown = () => {
  const { data: earnings, isLoading } = useQuery({
    queryKey: ['earnings-breakdown'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: earnings, error } = await supabase
        .from('earnings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return earnings || [];
    },
    enabled: true,
  });

  const getEarningTypeLabel = (type: string) => {
    switch (type) {
      case 'activation_pack':
        return 'Activation Pack';
      case 'direct_sales':
        return 'Direct Sales';
      case 'second_level':
        return 'Second Level';
      case 'team_bonus_level1':
        return 'Motorbike Bonus';
      case 'team_bonus_level2':
        return 'Car Bonus';
      default:
        return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-500" />
            Recent Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-gray-800 text-lg sm:text-xl font-black flex items-center">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-500" />
          Recent Earnings
        </CardTitle>
        <CardDescription className="font-semibold text-sm sm:text-base">
          Your latest earning transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {earnings && earnings.length > 0 ? (
          <div className="space-y-3">
            {earnings.map((earning) => (
              <Card key={earning.id} className="border-2 border-gray-200 hover:border-green-300 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(earning.status)}
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">
                          {getEarningTypeLabel(earning.earning_type)}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(earning.earned_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-lg">
                        ${earning.amount_usd}
                      </div>
                      <div className="text-xs text-gray-500">
                        TSH {(earning.amount_usd * 2500).toLocaleString()}
                      </div>
                      <Badge 
                        className={`${getStatusColor(earning.status)} text-white text-xs mt-1`}
                      >
                        {earning.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-gray-600 mb-2">No earnings yet</h3>
            <p className="text-gray-500 text-sm">
              Start referring new ambassadors to see your earnings here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EarningsBreakdown;
