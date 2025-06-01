
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Share2, Star, Trophy, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AmbassadorTools = () => {
  const downloadFlyer = () => {
    toast({
      title: "Download Started!",
      description: "WhatsApp flyer is being downloaded",
    });
  };

  const tools = [
    {
      title: "WhatsApp Flyer",
      description: "Branded promotional material for sharing",
      icon: Share2,
      action: "Download",
      color: "from-green-400 to-emerald-500",
      onClick: downloadFlyer
    },
    {
      title: "Training Materials",
      description: "Learn effective referral techniques",
      icon: Star,
      action: "Access",
      color: "from-blue-400 to-cyan-500",
      onClick: () => toast({ title: "Training Unlocked!", description: "Access your learning materials" })
    },
    {
      title: "Success Stories",
      description: "Real Ambassador success examples",
      icon: Trophy,
      action: "View",
      color: "from-yellow-400 to-orange-500",
      onClick: () => toast({ title: "Inspiration!", description: "Check out success stories" })
    },
    {
      title: "Support Center",
      description: "Get help when you need it",
      icon: Phone,
      action: "Contact",
      color: "from-purple-400 to-violet-500",
      onClick: () => toast({ title: "Support Ready!", description: "Our team is here to help" })
    }
  ];

  return (
    <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-gray-800 text-lg sm:text-xl font-black flex items-center">
          <Download className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-purple-500" />
          Ambassador Tools & Resources
        </CardTitle>
        <CardDescription className="font-semibold text-sm sm:text-base">
          Everything you need to succeed as an Ambassador
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="p-4 sm:p-6 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg cursor-pointer" onClick={tool.onClick}>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${tool.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <tool.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-800 text-base sm:text-lg mb-1 sm:mb-2">{tool.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2 sm:mb-3 leading-relaxed">{tool.description}</p>
                  <Button size="sm" className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs sm:text-sm">
                    {tool.action} →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AmbassadorTools;
