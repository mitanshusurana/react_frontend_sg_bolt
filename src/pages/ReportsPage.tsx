import React, { useState } from 'react';
import { Download, FileText, Filter, Printer, Search } from 'lucide-react';
import useGemstones from '../hooks/useGemstones';
import { FilterParams } from '../types';
import { formatDate, formatWeight } from '../utils/formatters';
import { gemstoneService } from '../services/gemstoneService';

const ReportsPage: React.FC = () => {
  const { gemstones, setFilters } = useGemstones();
  const [search, setSearch] = useState('');
  const [reportType, setReportType] = useState<'all' | 'summary' | 'detailed'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'last30' | 'last90' | 'thisYear'>('all');
  const [category, setCategory] = useState<string>('');
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [page] = React.useState(0);
  const [size] = React.useState(12);
  const [filters] = React.useState({}); // e.g. { type: 'Ruby' }

  const categories = Array.from(new Set((gemstones.content ?? []).map((gem: { category: any; }) => gem.category)));
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  const handleApplyFilters = () => {
    const filters: FilterParams = { search };
    
    if (category) {
      filters.category = category;
    }
    
    if (dateRange !== 'all') {
      const now = new Date();
      let dateFrom: Date | undefined;
      
      switch (dateRange) {
        case 'last30':
          dateFrom = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'last90':
          dateFrom = new Date(now.setDate(now.getDate() - 90));
          break;
        case 'thisYear':
          dateFrom = new Date(now.getFullYear(), 0, 1); // January 1st of current year
          break;
      }
      
      if (dateFrom) {
        filters.dateFrom = dateFrom.toISOString().split('T')[0];
      }
    }
    
    setFilters(filters);
  };
  
  const handleGeneratePDF = () => {
    window.alert('PDF generation would be implemented here in a production app.');
    // In a real app, we would use jspdf and jspdf-autotable to generate a PDF
  };
  
  const handleGenerateCSV = () => {
    // Simple CSV generation
    const headers = ['Name', 'Category', 'Type', 'Weight', 'Color', 'Dimensions', 'Acquisition Date'];
    const csvData = (gemstones.content ?? []).map((gem: { name: any; category: any; type: any; weight: any; color: any; dimensions: { length: any; width: any; height: any; }; acquisitionDate: any; }) => {
      return [
        gem.name,
        gem.category,
        gem.type,
        gem.weight,
        gem.color,
        `${gem.dimensions.length}x${gem.dimensions.width}x${gem.dimensions.height}`,
        gem.acquisitionDate
      ].join(',');
    });
    
    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gemstone_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handlePrint = () => {
    window.print();
  };

  React.useEffect(() => {
    setLoading(true);
    gemstoneService.getGemstones({ page: page + 1, size, ...filters })
      .then(setData)
      .finally(() => setLoading(false));
  }, [page, size, filters]);

  if (loading) return <div>Loading...</div>;
  if (!data) return null;

  return (
    <div className="container-page">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Reports</h1>
          <p className="mt-1 text-neutral-500">
            Generate and export gemstone inventory reports
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report filters sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Report Filters
            </h2>
            
            <div className="space-y-4">
              {/* Search */}
              <div>
                <label htmlFor="search" className="form-label">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    value={search}
                    onChange={handleSearchChange}
                    className="form-input pl-10"
                    placeholder="Search gemstones..."
                  />
                </div>
              </div>
              
              {/* Report Type */}
              <div>
                <label htmlFor="reportType" className="form-label">
                  Report Type
                </label>
                <select
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="form-select"
                >
                  <option value="all">All Gemstones</option>
                  <option value="summary">Summary Report</option>
                  <option value="detailed">Detailed Report</option>
                </select>
              </div>
              
              {/* Date Range */}
              <div>
                <label htmlFor="dateRange" className="form-label">
                  Date Range
                </label>
                <select
                  id="dateRange"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="form-select"
                >
                  <option value="all">All Time</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="last90">Last 90 Days</option>
                  <option value="thisYear">This Year</option>
                </select>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={String(cat)} value={String(cat)}>
                      {String(cat)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Apply filters button */}
              <button
                onClick={handleApplyFilters}
                className="btn-primary w-full"
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Export options */}
          <div className="card p-6 mt-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Options
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={handleGeneratePDF}
                className="btn-outline w-full flex items-center justify-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </button>
              
              <button
                onClick={handleGenerateCSV}
                className="btn-outline w-full flex items-center justify-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </button>
              
              <button
                onClick={handlePrint}
                className="btn-outline w-full flex items-center justify-center"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </button>
            </div>
          </div>
        </div>
        
        {/* Report content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Gemstone Inventory Report</h2>
              <div className="text-sm text-neutral-500">
                {formatDate(new Date().toISOString())}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Category: {category}
                  </span>
                )}
                
                {dateRange !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {dateRange === 'last30' ? 'Last 30 Days' : 
                     dateRange === 'last90' ? 'Last 90 Days' : 'This Year'}
                  </span>
                )}
                
                {reportType !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {reportType === 'summary' ? 'Summary Report' : 'Detailed Report'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Weight
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Color
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Acquisition Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {(gemstones.content ?? []).map((gemstone: { id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; category: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; weight: number; color: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; acquisitionDate: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                    <tr key={gemstone.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                        {gemstone.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {gemstone.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {gemstone.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {formatWeight(gemstone.weight)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {gemstone.color}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {gemstone.acquisitionDate}
                      </td>
                    </tr>
                  ))}
                  
                  {(gemstones.content ?? []).length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-neutral-500">
                        No gemstones found matching the filter criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Summary statistics */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Summary</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="text-sm text-neutral-500">Total Gemstones</div>
                  <div className="text-2xl font-semibold text-neutral-900">{(gemstones.content ?? []).length}</div>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="text-sm text-neutral-500">Total Weight</div>
                  <div className="text-2xl font-semibold text-neutral-900">
                    {formatWeight((gemstones.content ?? []).reduce((sum: any, gem: { weight: any; }) => sum + gem.weight, 0))}
                  </div>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="text-sm text-neutral-500">Categories</div>
                  <div className="text-2xl font-semibold text-neutral-900">{categories.length}</div>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="text-sm text-neutral-500">Average Weight</div>
                  <div className="text-2xl font-semibold text-neutral-900">
                    {(gemstones.content ?? []).length > 0
                      ? formatWeight((gemstones.content ?? []).reduce((sum: any, gem: { weight: any; }) => sum + gem.weight, 0) / (gemstones.content ?? []).length)
                      : '0 ct'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;