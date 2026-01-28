import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginStaffAsync, clearLoginError } from "@/store/slices/staffSlice";

export default function StaffLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  // Redux state
  const { loginLoading, loginError, isAuthenticated } = useAppSelector((state) => state.staff);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearLoginError());
  }, [dispatch]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearLoginError());

    try {
      const result = await dispatch(loginStaffAsync({
        email: formData.email,
        password: formData.password,
      })).unwrap();

      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.fullName}!`,
      });

      navigate("/staff/dashboard");
    } catch (error) {
      // Error is already set in Redux state
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-primary" fill="currentColor" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Staff Portal</CardTitle>
            <CardDescription className="mt-2">
              Sign in to access your staff dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loginLoading}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loginLoading}
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

            <Button type="submit" className="w-full" disabled={loginLoading}>
              {loginLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center space-y-2">
              {/* Staff typically don't register themselves, but if requested: */}
              {/* 
              <Button
                type="button"
                variant="link"
                className="text-sm text-muted-foreground"
                onClick={() => navigate("/staff/register")}
              >
                Don't have an account? Register here
              </Button>
               */}
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
        </CardContent>
      </Card>
    </div>
  );
}
