
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatUSD, formatTZS } from "@/lib/money";

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
        return 'First Generation';
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
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-600';
      case 'approved':
        return 'bg-blue-600';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-amber-500';
    }
  };

  const getStatusLabel = (status: string) =>
    ({ pending: 'Earned', approved: 'Approved', paid: 'Paid', cancelled: 'Cancelled' } as Record<string, string>)[status] || status;

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
        <CardTitle className="text-gray-800 text-lg sm:text-xl font-bold flex items-center">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-500" />
          Commission History
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Earned → Approved → Paid
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {earnings && earnings.length > 0 ? (
          <div className="space-y-3">
            {earnings.map((earning) => (
              <div key={earning.id} className="border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(earning.status)}
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {getEarningTypeLabel(earning.earning_type)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {new Date(earning.earned_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{formatUSD(Number(earning.amount_usd))}</div>
                  <div className="text-xs text-gray-500">{formatTZS(Number(earning.amount_usd))}</div>
                  <Badge className={`${getStatusColor(earning.status)} text-white text-xs mt-1`}>
                    {getStatusLabel(earning.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-600 mb-2">No commissions yet</h3>
            <p className="text-gray-500 text-sm">
              Commissions appear here once Ambassadors you sponsor activate their accounts.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EarningsBreakdown;
