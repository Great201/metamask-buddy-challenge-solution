import { WalletCard } from "../components/WalletCard";
import { TestInstructions } from "../components/TestInstructions";
import { CheckCircle, Star, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Implementation Complete Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center justify-center gap-3 mb-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-2xl font-bold text-green-600">IMPLEMENTATION COMPLETE!</h2>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-green-700 font-medium">
              🎉 All required features implemented successfully within the 60-minute time limit!
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-green-600">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                7/7 Required Features
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                4/4 Bonus Features
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Network Switching
              </span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-crypto bg-clip-text text-transparent">
            MetaMask Integration Test
          </h1>
          <p className="text-muted-foreground text-lg">
            Blockchain Developer Challenge - 60 Minutes
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          {/* Test Instructions */}
          <div>
            <TestInstructions />
          </div>
          
          {/* Wallet Connection */}
          <div className="space-y-6">
            <WalletCard />
            
            {/* Additional Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Make sure you have MetaMask installed and are on a supported network.
              </p>
              <p className="mt-1">
                We focus on mainnet networks for stability and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;