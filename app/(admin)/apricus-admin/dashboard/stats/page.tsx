"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Hotel,
  Calendar,
  Users,
  ArrowUp,
  ArrowDown,
  CreditCard,
  IndianRupee,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardStats = {
  contacts: {
    total: number;
    lastMonth: number;
    lastWeek: number;
    percentageChange: number;
  };
  bookings: {
    total: number;
    confirmed: number;
    pending: number;
    percentageChange: number;
  };
  locations: {
    total: number;
    percentageChange: number;
  };
  hotels: {
    total: number;
    percentageChange: number;
  };
  transactions: {
    total: number;
    lastMonth: number;
    percentageChange: number;
  };
  revenue: {
    total: number;
    lastMonth: number;
    percentageChange: number;
  };
};

const initialStats: DashboardStats = {
  contacts: {
    total: 0,
    lastMonth: 0,
    lastWeek: 0,
    percentageChange: 0,
  },
  bookings: {
    total: 0,
    confirmed: 0,
    pending: 0,
    percentageChange: 0,
  },
  locations: {
    total: 0,
    percentageChange: 0,
  },
  hotels: {
    total: 0,
    percentageChange: 0,
  },
  transactions: {
    total: 0,
    lastMonth: 0,
    percentageChange: 0,
  },
  revenue: {
    total: 0,
    lastMonth: 0,
    percentageChange: 0,
  },
};

const DashboardStatistics = () => {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (retryCount = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add a cache-busting timestamp parameter
      const cacheParam = `?t=${Date.now()}`; // Unique timestamp for every request

      const response = await fetch(`/api/statistics${cacheParam}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // Validate data structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid data structure received from API");
      }

      setStats(data);
    } catch (error) {
      console.error(`Fetch attempt ${retryCount + 1} failed:`, error);
      setError(
        `Failed to load statistics: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      // Retry logic (up to 3 retries with exponential backoff)
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => fetchStats(retryCount + 1), delay);
      } else {
        console.error("All retry attempts failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up periodic refresh (every 5 minutes)
    const refreshInterval = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const COLORS = {
    primary: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    purple: "#8B5CF6",
    gray: "#6B7280",
  };

  const bookingChartData = [
    { name: "Confirmed", value: stats?.bookings?.confirmed || 0 },
    { name: "Pending", value: stats?.bookings?.pending || 0 },
  ];

  const revenueChartData = [
    { name: "Last Month", revenue: stats?.revenue?.lastMonth || 0 },
    { name: "Total", revenue: stats?.revenue?.total || 0 },
  ];

  const StatCard = ({
    title,
    value = 0,
    percentageChange = 0,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    percentageChange: number;
    icon: React.ElementType;
    color: string;
  }) => (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold">
                {typeof value === "number" ? value.toLocaleString() : "0"}
              </h3>
              {percentageChange !== 0 && (
                <span
                  className={`text-sm font-medium flex items-center ${
                    percentageChange > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {percentageChange > 0 ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(percentageChange)}%
                </span>
              )}
            </div>
          </div>
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-8 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8 space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => fetchStats()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchStats()}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Locations"
          value={stats?.locations?.total ?? 0}
          percentageChange={stats?.locations?.percentageChange ?? 0}
          icon={Building2}
          color={COLORS.primary}
        />
        <StatCard
          title="Total Hotels"
          value={stats?.hotels?.total ?? 0}
          percentageChange={stats?.hotels?.percentageChange ?? 0}
          icon={Hotel}
          color={COLORS.success}
        />
        <StatCard
          title="Total Bookings"
          value={stats?.bookings?.total ?? 0}
          percentageChange={stats?.bookings?.percentageChange ?? 0}
          icon={Calendar}
          color={COLORS.warning}
        />
        <StatCard
          title="Total Contacts"
          value={stats?.contacts?.total ?? 0}
          percentageChange={stats?.contacts?.percentageChange ?? 0}
          icon={Users}
          color={COLORS.purple}
        />
        <StatCard
          title="Total Transactions"
          value={stats?.transactions?.total ?? 0}
          percentageChange={stats?.transactions?.percentageChange ?? 0}
          icon={CreditCard}
          color={COLORS.gray}
        />
        <StatCard
          title="Total Revenue"
          value={stats?.revenue?.total ?? 0}
          percentageChange={stats?.revenue?.percentageChange ?? 0}
          icon={IndianRupee}
          color={COLORS.success}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Booking Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      name,
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius =
                        25 + innerRadius + (outerRadius - innerRadius);
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          className="text-xs"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                        >
                          {`${name} (${value})`}
                        </text>
                      );
                    }}
                  >
                    {bookingChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? COLORS.success : COLORS.warning}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill={COLORS.success}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStatistics;
