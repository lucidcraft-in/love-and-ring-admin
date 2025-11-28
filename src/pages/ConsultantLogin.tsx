import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function ConsultantLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate API call - Replace with actual API call
    try {
      // Mock validation - in real app, call POST /api/auth/consultant/login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock responses based on demo accounts
      if (formData.username === "pending_consultant") {
        setError("Your account is pending approval. Please wait for admin verification.");
        setIsLoading(false);
        return;
      }

      if (formData.username === "rejected_consultant") {
        setError("Your account has been rejected. Please contact support for more information.");
        setIsLoading(false);
        return;
      }

      if (formData.username === "suspended_consultant") {
        setError("Your account has been suspended. Please contact support.");
        setIsLoading(false);
        return;
      }

      // Successful login simulation
      if (formData.username && formData.password) {
        // Store consultant session
        const mockConsultant = {
          id: "c1",
          username: formData.username,
          email: `${formData.username}@agency.com`,
          fullName: "Demo Consultant",
          role: "consultant",
          permissions: {
            create_profile: true,
            edit_profile: true,
            view_profile: true,
            delete_profile: false,
          },
        };
        sessionStorage.setItem("consultantUser", JSON.stringify(mockConsultant));
        
        toast({
          title: "Login Successful",
          description: "Welcome to your consultant dashboard!",
        });
        
        navigate("/consultant/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Consultant Portal</CardTitle>
            <CardDescription className="mt-2">
              Sign in to access your consultant dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username or email"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="link"
                className="text-sm text-muted-foreground"
                onClick={() => navigate("/consultant/register")}
              >
                Don't have an account? Register here
              </Button>
              <div>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-muted-foreground"
                  onClick={() => navigate("/login")}
                >
                  Admin Login
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo:</strong> Use any username/password to login.
              <br />
              Try "pending_consultant" to see pending account message.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
