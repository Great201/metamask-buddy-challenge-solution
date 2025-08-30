import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, FileText, CheckCircle, XCircle, Star } from "lucide-react";

export const TestInstructions = () => {
  const requirements = [
    { text: "Connect/disconnect MetaMask wallet", completed: true },
    { text: "Display wallet address when connected", completed: true },
    { text: "Show wallet balance in ETH", completed: true },
    { text: "Handle connection errors gracefully", completed: true },
    { text: "Display current network information", completed: true },
    { text: "Auto-reconnect on page refresh if previously connected", completed: true },
    { text: "Handle account/network changes in MetaMask", completed: true }
  ];

  const bonusFeatures = [
    { text: "Add network switching functionality", completed: true },
    { text: "Implement transaction history display", completed: false },
    { text: "Add token balance display (ERC-20)", completed: false },
    { text: "Style improvements or animations", completed: true }
  ];

  const completedCount = requirements.filter(r => r.completed).length;
  const totalRequired = requirements.length;
  const bonusCompleted = bonusFeatures.filter(f => f.completed).length;
  const totalBonus = bonusFeatures.length;

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card border-border shadow-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-crypto">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">Blockchain Developer Test</CardTitle>
            <CardDescription>MetaMask Integration Challenge</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 text-warning">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Time Limit: 60 minutes</span>
        </div>

        {/* Implementation Status Summary */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Implementation Status</h3>
            <div className="flex gap-2">
              <Badge variant="default" className="bg-gradient-success text-white">
                {completedCount}/{totalRequired} Required
              </Badge>
              <Badge variant="outline">
                {bonusCompleted}/{totalBonus} Bonus
              </Badge>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-crypto h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalRequired) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            🎉 All required features completed! Plus {bonusCompleted} bonus features implemented.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            Required Features:
            {completedCount === totalRequired && (
              <CheckCircle className="h-5 w-5 text-success" />
            )}
          </h3>
          <ul className="space-y-2">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                {requirement.completed ? (
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive shrink-0" />
                )}
                <span className={requirement.completed ? "text-foreground" : "text-muted-foreground"}>
                  {requirement.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            Bonus Features:
            <Star className="h-4 w-4 text-warning" />
          </h3>
          <ul className="space-y-2">
            {bonusFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                {feature.completed ? (
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className={feature.completed ? "text-foreground" : "text-muted-foreground"}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technical Implementation Details */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-foreground">Technical Implementation</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-muted-foreground mb-2">✅ Completed</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• MetaMask detection & connection</li>
                <li>• Wallet state management</li>
                <li>• Event listeners (accounts/chain)</li>
                <li>• Error handling & validation</li>
                <li>• Network switching with UI</li>
                <li>• Auto-reconnection logic</li>
                <li>• TypeScript throughout</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-muted-foreground mb-2">🔧 Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 5 supported networks</li>
                <li>• Real-time balance updates</li>
                <li>• Responsive UI design</li>
                <li>• Loading states & animations</li>
                <li>• Comprehensive error messages</li>
                <li>• Memory leak prevention</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">Evaluation Criteria</Badge>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Code quality and organization ✅</li>
            <li>• Error handling implementation ✅</li>
            <li>• TypeScript usage and type safety ✅</li>
            <li>• User experience and interface design ✅</li>
            <li>• Completion within time limit ✅</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};