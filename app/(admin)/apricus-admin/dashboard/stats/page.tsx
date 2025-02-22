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
} from "lucide-react";

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
};

const DashboardStatistics = () => {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/statistics");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const COLORS = {
    primary: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    purple: "#8B5CF6",
    gray: "#6B7280",
  };

  const bookingChartData = stats
    ? [
        { name: "Confirmed", value: stats.bookings.confirmed },
        { name: "Pending", value: stats.bookings.pending },
      ]
    : [];

  const contactChartData = stats
    ? [
        { name: "Last Week", count: stats.contacts.lastWeek },
        { name: "Last Month", count: stats.contacts.lastMonth },
        { name: "Total", count: stats.contacts.total },
      ]
    : [];

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
        {[...Array(4)].map((_, i) => (
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

  if (!stats) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load dashboard statistics. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 p-8">
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

        {/* Contact Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Contact Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contactChartData}>
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
                    dataKey="count"
                    fill={COLORS.primary}
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
