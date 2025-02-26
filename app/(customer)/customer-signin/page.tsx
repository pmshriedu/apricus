"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must not exceed 50 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function CustomerLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle query parameters
  useEffect(() => {
    // Show success message if redirected from registration
    if (searchParams.get("registered") === "true") {
      setSuccess(
        "Registration successful! Please log in with your new account."
      );
    }

    // Get the redirect URL if coming from booking flow
    const returnTo = searchParams.get("returnTo");
    if (returnTo) {
      // Store the return URL in session storage to use after login
      sessionStorage.setItem("bookingReturnUrl", returnTo);
    }
  }, [searchParams]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      // Check if we need to return to a booking process
      const returnUrl = sessionStorage.getItem("bookingReturnUrl");
      if (returnUrl) {
        sessionStorage.removeItem("bookingReturnUrl");
        router.push(returnUrl);
      } else {
        router.push("/customer-dashboard"); // Redirect to home page if no return URL
      }

      router.refresh(); // Refresh to update session state
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="font-comfortaaBold text-3xl">
            Welcome Back
          </CardTitle>
          <CardDescription className="font-comfortaaRegular text-gray-600">
            Sign in to your Apricus Hotels account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription className="font-comfortaaBold">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert
              variant="default"
              className="mb-6 bg-green-50 border-green-200"
            >
              <AlertDescription className="font-comfortaaBold text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-comfortaaMedium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your.email@example.com"
                        className="font-comfortaaRegular"
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage className="font-comfortaaLight" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-comfortaaMedium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="font-comfortaaRegular"
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage className="font-comfortaaLight" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 font-comfortaaMedium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <div className="text-center font-comfortaaRegular">
            Don&lsquo;t have an account?{" "}
            <Link
              href="/customer-signup"
              className="text-primary hover:underline font-comfortaaMedium inline-flex items-center"
            >
              Create account
              <UserPlus className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
