"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, Lock, Shield, Calendar } from "lucide-react";

// Profile update schema
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

// Password change schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface UserData {
  name?: string;
  role?: string;
  id?: string;
  createdAt?: string;
  passwordUpdatedAt?: string;
  lastLogin?: string;
}

export default function AdminProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/admin/profile");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          profileForm.setValue("name", data.name || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session, profileForm]);

  const onProfileSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setProfileError(data.error || "Failed to update profile");
        return;
      }

      setProfileSuccess("Profile updated successfully");

      // Update session to reflect name change
      await update({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      setProfileError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setLoading(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || "Failed to update password");
        return;
      }

      setPasswordSuccess("Password updated successfully");
      passwordForm.reset();
    } catch (error) {
      console.error("Password update error:", error);
      setPasswordError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | Date | null | undefined) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-comfortaaBold text-3xl flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Admin Profile
          </CardTitle>
          <CardDescription className="font-comfortaaRegular">
            Manage your administrator account details and security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="profile"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="font-comfortaaMedium">
                Profile Details
              </TabsTrigger>
              <TabsTrigger value="password" className="font-comfortaaMedium">
                Security Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              {profileSuccess && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <AlertDescription className="font-comfortaaBold text-green-700">
                    {profileSuccess}
                  </AlertDescription>
                </Alert>
              )}

              {profileError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription className="font-comfortaaBold">
                    {profileError}
                  </AlertDescription>
                </Alert>
              )}

              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-comfortaaMedium">
                          Administrator Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your full name"
                            className="font-comfortaaRegular"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="font-comfortaaLight" />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <FormItem>
                      <FormLabel className="font-comfortaaMedium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          value={session.user?.email || ""}
                          readOnly
                          className="font-comfortaaRegular bg-gray-50"
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground mt-2 font-comfortaaLight">
                        Email address cannot be changed
                      </p>
                    </FormItem>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-comfortaaMedium text-muted-foreground mb-2">
                        Admin Role
                      </h3>
                      <p className="font-comfortaaRegular text-lg">
                        {userData?.role || "Administrator"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-comfortaaMedium text-muted-foreground mb-2">
                        Admin ID
                      </h3>
                      <p className="font-comfortaaRegular text-lg">
                        {userData?.id || "N/A"}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 font-comfortaaMedium"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="password">
              {passwordSuccess && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <AlertDescription className="font-comfortaaBold text-green-700">
                    {passwordSuccess}
                  </AlertDescription>
                </Alert>
              )}

              {passwordError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription className="font-comfortaaBold">
                    {passwordError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-comfortaaMedium text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Account Created
                    </h3>
                    <p className="font-comfortaaRegular">
                      {formatDate(userData?.createdAt)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-comfortaaMedium text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Last Password Update
                    </h3>
                    <p className="font-comfortaaRegular">
                      {formatDate(userData?.passwordUpdatedAt) || "Never"}
                    </p>
                  </div>
                </div>

                <Alert className="mb-6 bg-amber-50 border-amber-200">
                  <AlertDescription className="font-comfortaaRegular text-amber-700 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    For security reasons, please use a strong, unique password
                    that you don&apos;t use elsewhere.
                  </AlertDescription>
                </Alert>
              </div>

              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-comfortaaMedium">
                          Current Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your current password"
                            className="font-comfortaaRegular"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="font-comfortaaLight" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-comfortaaMedium">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter new password"
                            className="font-comfortaaRegular"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="font-comfortaaLight" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-comfortaaMedium">
                          Confirm New Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm new password"
                            className="font-comfortaaRegular"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="font-comfortaaLight" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 font-comfortaaMedium"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t flex flex-col items-start px-6 py-4">
          <p className="text-sm text-muted-foreground font-comfortaaLight mb-1">
            <Shield className="h-4 w-4 inline mr-1" /> Administrator privileges
            active
          </p>
          <p className="text-xs text-muted-foreground font-comfortaaLight">
            Last login: {formatDate(userData?.lastLogin) || "N/A"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
