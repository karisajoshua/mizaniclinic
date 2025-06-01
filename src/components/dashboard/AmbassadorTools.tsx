
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Share2, Star, Trophy, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AmbassadorTools = () => {
  const downloadFlyer = () => {
    toast({
      title: "Download Started! 📱",
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
      onClick: () => toast({ title: "Training Unlocked! 📚", description: "Access your learning materials" })
    },
    {
      title: "Success Stories",
      description: "Real Ambassador success examples",
      icon: Trophy,
      action: "View",
      color: "from-yellow-400 to-orange-500",
      onClick: () => toast({ title: "Inspiration! 💪", description: "Check out success stories" })
    },
    {
      title: "Support Center",
      description: "Get help when you need it",
      icon: Phone,
      action: "Contact",
      color: "from-purple-400 to-violet-500",
      onClick: () => toast({ title: "Support Ready! 🤝", description: "Our team is here to help" })
    }
  ];

  return (
    <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
      <CardHeader>
        <CardTitle className="text-gray-800 text-xl font-black flex items-center">
          <Download className="w-6 h-6 mr-3 text-purple-500" />
          Ambassador Tools & Resources 🛠️
        </CardTitle>
        <CardDescription className="font-semibold">
          Everything you need to succeed as an Ambassador
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="p-6 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg cursor-pointer" onClick={tool.onClick}>
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 text-lg mb-2">{tool.title}</h3>
                  <p className="text-gray-600 text-sm font-medium mb-3">{tool.description}</p>
                  <Button size="sm" className="bg-gray-800 hover:bg-gray-900 text-white font-bold">
                    {tool.action} ➤
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
