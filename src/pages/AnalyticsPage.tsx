import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Diamond, DollarSign, TrendingUp } from 'lucide-react';
import useGemstones from '../hooks/useGemstones';
import { formatCurrency, formatDate } from '../utils/formatters';

const AnalyticsPage: React.FC = () => {
  const { gemstones } = useGemstones();
  const gemstoneList = gemstones?.content ?? [];
  
  // Calculate analytics data
  const analyticsData = useMemo(() => {
    // Count by category
    const categoryCount: Record<string, number> = {};
    const typeCount: Record<string, number> = {};
    const categoryValue: Record<string, number> = {};
    let totalValue = 0;
    
    gemstoneList.forEach((gem) => {
      // Category count
      categoryCount[gem.category] = (categoryCount[gem.category] || 0) + 1;
      
      // Type count
      typeCount[gem.type] = (typeCount[gem.type] || 0) + 1;
      
      // Values
      if (typeof gem.estimatedValue === 'number') {
        totalValue += gem.estimatedValue;
        categoryValue[gem.category] = (categoryValue[gem.category] || 0) + gem.estimatedValue;
      }
    });
    
    // Format for charts
    const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
    const typeData = Object.entries(typeCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 types
    
    const valueData = Object.entries(categoryValue).map(([name, value]) => ({ name, value }));
    
    // Recent additions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentAdditions = gemstoneList
      .filter((gem: { createdAt: string | number | Date; }) => new Date(gem.createdAt) > thirtyDaysAgo)
      .sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      categoryData,
      typeData,
      valueData,
      recentAdditions,
      totalValue,
      totalItems: gemstoneList.length
    };
  }, [gemstoneList]);
  
  // Colors for charts
  const pieColors = ['#1A4B8C', '#2E8B57', '#E0115F', '#F59E0B', '#8B5CF6', '#EC4899'];
  const barColors = ['#1A4B8C', '#2E8B57', '#E0115F'];

  return (
    <div className="container-page">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Analytics Dashboard</h1>
        <p className="mt-1 text-neutral-500">
          Visual insights into your gemstone collection
        </p>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-primary-100 p-3 mr-4">
              <Diamond className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Gemstones</p>
              <p className="text-2xl font-semibold text-neutral-900">{analyticsData.totalItems}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-secondary-100 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-secondary-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Value</p>
              <p className="text-2xl font-semibold text-neutral-900">{formatCurrency(analyticsData.totalValue)}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-accent-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-accent-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Recent Additions</p>
              <p className="text-2xl font-semibold text-neutral-900">{analyticsData.recentAdditions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-success-100 p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Avg. Value</p>
              <p className="text-2xl font-semibold text-neutral-900">
                {analyticsData.totalItems > 0 
                  ? formatCurrency(analyticsData.totalValue / analyticsData.totalItems)
                  : formatCurrency(0)
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Distribution by Category */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Distribution by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.categoryData.map((_entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={pieColors[index % pieColors.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} gemstones`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top Gemstone Types */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Top Gemstone Types</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.typeData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => [`${value} gemstones`, 'Count']} />
                <Bar dataKey="value" fill={barColors[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Value by Category */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Value by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.valueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Value']} />
                <Legend />
                <Bar dataKey="value" fill={barColors[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Recent Additions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Additions</h2>
          {analyticsData.recentAdditions.length > 0 ? (
            <div className="overflow-hidden">
              <ul className="divide-y divide-neutral-200 max-h-80 overflow-y-auto pr-2">
                {analyticsData.recentAdditions.map((gem: { id: React.Key | null | undefined; images: any[]; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; weight: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; createdAt: string; }) => (
                  <li key={gem.id} className="py-3 flex items-center">
                    <div className="w-10 h-10 rounded-md overflow-hidden mr-4">
                      <img 
                        src={gem.images[0] || 'https://images.pexels.com/photos/68740/diamond-gem-cubic-zirconia-jewel-68740.jpeg'} 
                        alt={typeof gem.name === 'string' ? gem.name : gem.name?.toString() || ''}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {gem.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {gem.type} • {gem.weight} ct
                      </p>
                    </div>
                    <div className="text-xs text-neutral-500">
                      {formatDate(gem.createdAt)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-10 text-neutral-500">
              No gemstones added in the last 30 days
            </div>
          )}
        </div>
      </div>
      
      {/* Insights */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Collection Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-50 rounded-lg p-4">
            <h3 className="text-primary-800 font-medium mb-2">Distribution</h3>
            <p className="text-primary-700 text-sm">
              {analyticsData.categoryData.length > 0 &&
                `Your collection is primarily ${analyticsData.categoryData[0].name} gemstones (${Math.round((analyticsData.categoryData[0].value / analyticsData.totalItems) * 100)}%).`
              }
            </p>
          </div>
          
          <div className="bg-secondary-50 rounded-lg p-4">
            <h3 className="text-secondary-800 font-medium mb-2">Value Distribution</h3>
            <p className="text-secondary-700 text-sm">
              {analyticsData.valueData.length > 0 &&
                `${analyticsData.valueData[0].name} gemstones represent the highest value in your collection.`
              }
            </p>
          </div>
          
          <div className="bg-accent-50 rounded-lg p-4">
            <h3 className="text-accent-800 font-medium mb-2">Collection Growth</h3>
            <p className="text-accent-700 text-sm">
              {`You've added ${analyticsData.recentAdditions.length} new gemstones in the last 30 days.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;