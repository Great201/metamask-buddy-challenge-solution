import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWallet, formatAddress, getChainName, NETWORKS } from "../hooks/useWallet";
import { Wallet, ExternalLink, AlertCircle, CheckCircle, Loader2, Network } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const WalletCard = () => {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    error, 
    chainId, 
    balance,
    connect, 
    disconnect, 
    isMetamaskInstalled,
    switchNetwork
  } = useWallet();

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-crypto">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl font-bold">MetaMask Wallet</CardTitle>
          <CardDescription>
            Connect your MetaMask wallet to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isMetamaskInstalled && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                MetaMask not detected. Please{" "}
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  install MetaMask <ExternalLink className="h-3 w-3" />
                </a>{" "}
                to continue.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isConnected && address && (
            <div className="space-y-3 rounded-lg bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Badge variant="default" className="bg-gradient-success text-white">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Address</span>
                <code className="text-sm font-mono">{formatAddress(address)}</code>
              </div>
              
              {chainId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Network</span>
                  <span className="text-sm">{getChainName(chainId)}</span>
                </div>
              )}
              
              {balance && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Balance</span>
                  <span className="text-sm font-mono">{balance} ETH</span>
                </div>
              )}
            </div>
          )}

          {/* Network Switching Section */}
          {isConnected && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Network className="h-4 w-4" />
                Switch Network
              </div>
              <div className="grid grid-cols-2 gap-2">
                {NETWORKS.map((network) => (
                  <Button
                    key={network.chainId}
                    variant={chainId === network.chainId ? "default" : "outline"}
                    size="sm"
                    onClick={() => switchNetwork(network.chainId)}
                    className={`text-xs ${
                      chainId === network.chainId 
                        ? 'bg-gradient-crypto text-white' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-medium">{network.name}</span>
                      <span className="text-xs opacity-75">
                        {network.testnet ? 'Testnet' : 'Mainnet'}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={connect}
                disabled={!isMetamaskInstalled || isConnecting}
                className="flex-1 bg-gradient-crypto hover:shadow-glow transition-all duration-200"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={disconnect}
                className="flex-1"
              >
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};