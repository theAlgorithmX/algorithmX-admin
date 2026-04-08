import React, { useState, useEffect } from "react";

const DashboardCards = () => {
  // Simulated API data - replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    totalBlogs: 0,
    totalEbooks: 0,
    totalClients: 0,
    glossaryEntries: 0,
    brandAudits: 0,
    productAudits: 0,
    activeProjects: 0,
    completedTasks: 0,
  });

  const [loading, setLoading] = useState(true);

  // Simulate API call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setDashboardData({
          totalBlogs: 245,
          totalEbooks: 18,
          totalClients: 67,
          glossaryEntries: 1250,
          brandAudits: 34,
          productAudits: 89,
          activeProjects: 12,
          completedTasks: 156,
        });
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  // Card component
  const DashboardCard = ({ title, value, icon, color, trend, trendValue }) => (
    <div
      className="relative rounded-lg shadow-md p-6 border-l-4 overflow-hidden"
      style={{ borderLeftColor: color }}
    >
      {/* faint background tint */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundColor: color }}
      ></div>

      {/* content above the tint */}
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
          <div className="mt-2 flex items-baseline">
            {value ? (
              <span className="text-3xl font-bold text-white">
                {value.toLocaleString()}
              </span>
            ) : (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            )}
            {trend && trendValue && (
              <span
                className={`ml-2 text-sm font-medium ${
                  trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend === "up" ? "↗" : "↘"} {trendValue}%
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  // Welcome/Greeting Card
  const GreetingCard = () => (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl text-white font-bold mb-2">
            Welcome to Your Dashboard
          </h2>
          <p className="text-blue-100 mb-4">
            Here's your business overview at a glance
          </p>
          {/* <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-white border-opacity-30 hover:bg-opacity-30">
            View Reports
          </button> */}
        </div>
        <div className="hidden md:block">
          <svg
            className="w-24 h-24 text-white opacity-20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
      </div>
    </div>
  );

  // Quick Stats Card
  const QuickStatsCard = () => (
    <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl text-white font-bold mb-2">This Month</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-green-100">Revenue Growth</span>
              <span className="text-white font-semibold">+24%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-100">New Projects</span>
              <span className="text-white font-semibold">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-100">Client Satisfaction</span>
              <span className="text-white font-semibold">98%</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <svg
            className="w-24 h-24 text-white opacity-20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-300 mt-2">
            Monitor your business metrics and performance
          </p>
        </div>

        {/* Greeting Cards - Half Width */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GreetingCard />
          <QuickStatsCard />
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Blogs"
            value={dashboardData.totalBlogs}
            icon="📝"
            color="#3B82F6"
          />

          <DashboardCard
            title="E-books"
            value={dashboardData.totalEbooks}
            icon="📚"
            color="#10B981"
          />

          <DashboardCard
            title="Total Clients"
            value={dashboardData.totalClients}
            icon="👥"
            color="#8B5CF6"
          />

          <DashboardCard
            title="Glossary Entries"
            value={dashboardData.glossaryEntries}
            icon="📖"
            color="#F59E0B"
          />

          <DashboardCard
            title="Brand Audits"
            value={dashboardData.brandAudits}
            icon="🔍"
            color="#EF4444"
          />

          <DashboardCard
            title="Product Audits"
            value={dashboardData.productAudits}
            icon="⚡"
            color="#06B6D4"
          />

          <DashboardCard
            title="Active Projects"
            value={dashboardData.activeProjects}
            icon="🚀"
            color="#84CC16"
          />

          <DashboardCard
            title="Completed Tasks"
            value={dashboardData.completedTasks}
            icon="✅"
            color="#EC4899"
          />
        </div>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZET4P9C2TK"
        ></script>
      </div>
    </div>
  );
};

export default DashboardCards;
