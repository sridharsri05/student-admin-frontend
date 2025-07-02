import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Sphere, Box, Torus, OrbitControls } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, Mail, Lock, GraduationCap } from "lucide-react";
import { LoginBackground } from "@/components/auth/LoginBackground";
import { apiCall } from "../config/api";
import { apiConfig } from "../config/apiConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    // rememberMe: false
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Login attempt:", loginData);

      const data = await apiCall(`${apiConfig.endpoints.auth}/login`, {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      if (data.accessToken && data.user) {
        login(data.user, data.accessToken);

        console.log("Login successful:", data);

        // ✅ Navigate based on role
        if (data.user.role === "admin") {
          toast.success("Login successful!", {
            description: "Welcome back, Admin! 👨‍💼",
            // duration: 3000,
          });
          navigate("/");
        } else if (data.user.role === "student") {
          toast.success("Login successful!", {
            description: "Welcome to your student dashboard! 🎓",
            duration: 3000,
          });
          navigate("/student-dashboard");
        }
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <LoginBackground />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Login Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="glass border-white/20 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink rounded-full flex items-center justify-center shadow-lg shadow-neon-cyan/30">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gradient">
                Welcome Back
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Sign in to your EduFlow account
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 glass border-white/20 focus:border-neon-cyan/50 focus:ring-neon-cyan/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 glass border-white/20 focus:border-neon-cyan/50 focus:ring-neon-cyan/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={loginData.rememberMe}
                      onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                      className="rounded border-white/20 bg-white/10"
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <a href="#" className="text-sm text-neon-cyan hover:text-neon-cyan/80">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink hover:from-neon-cyan/80 hover:via-neon-purple/80 hover:to-neon-pink/80 text-white font-medium py-3 shadow-lg shadow-neon-cyan/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="text-neon-cyan hover:text-neon-cyan/80 font-medium"
                  >
                    Sign up
                  </a>
                </p>
              </div>

              {/* Social Login Options */}
              {/* <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="glass border-white/20 hover:bg-white/10"
                    onClick={() => console.log("Google login")}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="glass border-white/20 hover:bg-white/10"
                    onClick={() => console.log("Microsoft login")}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                      />
                    </svg>
                    Microsoft
                  </Button>
                </div>
              </div> */}
            </CardContent>
          </Card>

          {/* Color Variation Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse"></div>
            <div
              className="w-3 h-3 rounded-full bg-neon-purple animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-neon-pink animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-neon-green animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
