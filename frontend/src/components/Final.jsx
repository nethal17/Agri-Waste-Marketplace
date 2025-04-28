import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import { Button, Card, Row, Col, Spin, Typography, Divider, Statistic, Tag } from 'antd';
import { 
  HistoryOutlined, 
  DollarOutlined, 
  UserOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  FilePdfOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Create a fallback component for CountUp
const CountUpFallback = ({ end, duration, separator, decimal }) => {
  return <span>{end.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
};

// Try to import CountUp, but use fallback if it fails
let CountUp;
try {
  CountUp = require('react-countup').default;
} catch (e) {
  console.warn('react-countup not available, using fallback');
  CountUp = CountUpFallback;
}

const { Title, Text, Paragraph } = Typography;

const Final = () => {
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [highTotalAmount, setHighTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productListingPayments, setProductListingPayments] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchAndCalculateTotals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stripe-payments');
        const payments = response.data;

        const total = payments.reduce((sum, payment) => {
          const amount = parseFloat(payment.payAmount) || 0;
          return sum + amount;
        }, 0);

        const highTotal = payments.reduce((sum, payment) => {
          const amount = parseFloat(payment.payAmount) || 0;
          return amount >= 20000 ? sum + amount : sum;
        }, 0);

        const productListingTotal = payments.reduce((sum, payment) => {
          if (payment.payAmount === 1000) {
            return sum + 1000;
          }
          return sum;
        }, 0);

        setTotalAmount(total);
        setHighTotalAmount(highTotal);
        setProductListingPayments(productListingTotal);
        
        // Generate sample monthly data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = months.map(month => ({
          name: month,
          amount: Math.floor(Math.random() * 50000) + 10000
        }));
        setMonthlyData(monthlyData);
        
        // Generate sample category data
        const categoryData = [
          { name: 'Organic', value: 65 },
          { name: 'Non-Organic', value: 35 }
        ];
        setCategoryData(categoryData);
        
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to fetch payment data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateTotals();
  }, []);

  const farmerPayment = totalAmount * 0.8;
  const profit = totalAmount * 0.2;

  const pieData = [
    { name: 'Total Earned', value: totalAmount },
    { name: 'Paid to Farmers (80%)', value: farmerPayment },
    { name: 'Profit (20%)', value: profit }
  ];

  const COLORS = ['#4ade80', '#60a5fa', '#facc15'];
  const CATEGORY_COLORS = ['#10b981', '#6366f1'];

  const generatePDF = async () => {
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('payment-summary-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center ml-64">
            <Spin size="large" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center ml-64">
            <div className="text-center">
              <p className="text-red-500 text-xl mb-4">{error}</p>
              <Button type="primary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50 ml-64">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <Title level={2} className="text-3xl font-bold text-gray-800 mb-1">Total Payments Summary</Title>
                <Text className="text-gray-500">Comprehensive overview of all financial transactions</Text>
              </div>
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                onClick={generatePDF}
                className="h-12 text-lg flex items-center"
                style={{
                  backgroundColor: '#f5222d',
                  borderColor: '#f5222d',
                  gap: '8px'
                }}
              >
                Download Report
              </Button>
            </div>

            <div ref={reportRef}>
              <div className="flex flex-col gap-10">
                {/* Summary Cards */}
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-md hover:shadow-lg transition-shadow border-0 rounded-lg">
                      <Statistic
                        title={<span className="text-gray-600">Total Revenue</span>}
                        value={totalAmount}
                        precision={2}
                        prefix={<DollarOutlined className="text-green-500" />}
                        suffix="Rs."
                        valueStyle={{ color: '#10b981', fontSize: '24px' }}
                      />
                      <div className="mt-2 flex items-center">
                        <RiseOutlined className="text-green-500 mr-1" />
                        <span className="text-green-500 text-sm">12% increase</span>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-md hover:shadow-lg transition-shadow border-0 rounded-lg">
                      <Statistic
                        title={<span className="text-gray-600">Farmer Payments</span>}
                        value={farmerPayment}
                        precision={2}
                        prefix={<UserOutlined className="text-blue-500" />}
                        suffix="Rs."
                        valueStyle={{ color: '#3b82f6', fontSize: '24px' }}
                      />
                      <div className="mt-2 flex items-center">
                        <CheckCircleOutlined className="text-blue-500 mr-1" />
                        <span className="text-blue-500 text-sm">80% of revenue</span>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-md hover:shadow-lg transition-shadow border-0 rounded-lg">
                      <Statistic
                        title={<span className="text-gray-600">Driver Payments</span>}
                        value={highTotalAmount}
                        precision={2}
                        prefix={<TeamOutlined className="text-purple-500" />}
                        suffix="Rs."
                        valueStyle={{ color: '#8b5cf6', fontSize: '24px' }}
                      />
                      <div className="mt-2 flex items-center">
                        <ClockCircleOutlined className="text-purple-500 mr-1" />
                        <span className="text-purple-500 text-sm">Monthly salaries</span>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-md hover:shadow-lg transition-shadow border-0 rounded-lg">
                      <Statistic
                        title={<span className="text-gray-600">Net Profit</span>}
                        value={profit}
                        precision={2}
                        prefix={<DollarOutlined className="text-yellow-500" />}
                        suffix="Rs."
                        valueStyle={{ color: '#f59e0b', fontSize: '24px' }}
                      />
                      <div className="mt-2 flex items-center">
                        <RiseOutlined className="text-yellow-500 mr-1" />
                        <span className="text-yellow-500 text-sm">20% of revenue</span>
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* Payment Summary Box */}
                <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                    <Title level={3} className="text-white m-0">Payment Summary</Title>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Side: Driver Salary */}
                      <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-4">
                          <div className="flex items-center mb-2">
                            <TeamOutlined className="text-2xl text-purple-600 mr-2" />
                            <Title level={4} className="m-0">Payment for Driver Salary</Title>
                          </div>
                          <div className="flex items-baseline">
                            <Text className="text-3xl font-bold text-purple-600">Rs. <CountUp end={highTotalAmount} duration={2} separator="," decimal="." /></Text>
                            <Tag color="purple" className="ml-2">Monthly</Tag>
                          </div>
                          <Paragraph className="text-gray-500 mt-2">
                            Regular salary payments to truck drivers for delivery services.
                          </Paragraph>
                        </div>
                      </div>

                      {/* Right Side: Other Payments */}
                      <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-4">
                          <div className="flex items-center mb-2">
                            <DollarOutlined className="text-2xl text-green-600 mr-2" />
                            <Title level={4} className="m-0">Total Product Sales</Title>
                          </div>
                          <div className="flex items-baseline">
                            <Text className="text-3xl font-bold text-green-600">Rs. <CountUp end={totalAmount} duration={2} separator="," decimal="." /></Text>
                            <Tag color="green" className="ml-2">Total</Tag>
                          </div>
                          <Paragraph className="text-gray-500 mt-2">
                            Total revenue from all product sales in the marketplace.
                          </Paragraph>
                        </div>
                        
                        <div className="border-b border-gray-200 pb-4">
                          <div className="flex items-center mb-2">
                            <UserOutlined className="text-2xl text-blue-600 mr-2" />
                            <Title level={4} className="m-0">Farmer Payments (80%)</Title>
                          </div>
                          <div className="flex items-baseline">
                            <Text className="text-3xl font-bold text-blue-600">Rs. <CountUp end={farmerPayment} duration={2} separator="," decimal="." /></Text>
                            <Tag color="blue" className="ml-2">80%</Tag>
                          </div>
                          <Paragraph className="text-gray-500 mt-2">
                            Payments to farmers for their agricultural waste products.
                          </Paragraph>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <RiseOutlined className="text-2xl text-yellow-600 mr-2" />
                            <Title level={4} className="m-0">Net Profit (20%)</Title>
                          </div>
                          <div className="flex items-baseline">
                            <Text className="text-3xl font-bold text-yellow-600">Rs. <CountUp end={profit} duration={2} separator="," decimal="." /></Text>
                            <Tag color="gold" className="ml-2">20%</Tag>
                          </div>
                          <Paragraph className="text-gray-500 mt-2">
                            Net profit from all marketplace transactions.
                          </Paragraph>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Charts Section */}
                <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4 text-white">
                    <Title level={3} className="text-white m-0">Payment Analysis</Title>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left: Monthly Transactions Chart */}
                      <div>
                        <div className="flex items-center mb-4">
                          <BarChartOutlined className="text-2xl text-indigo-600 mr-2" />
                          <Title level={4} className="m-0">Monthly Transactions</Title>
                        </div>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={monthlyData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Right: Payment Distribution Chart */}
                      <div>
                        <div className="flex items-center mb-4">
                          <PieChartOutlined className="text-2xl text-indigo-600 mr-2" />
                          <Title level={4} className="m-0">Payment Distribution</Title>
                        </div>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
                              <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Category Distribution */}
                <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 text-white">
                    <Title level={3} className="text-white m-0">Waste Category Distribution</Title>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left: Category Pie Chart */}
                      <div>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Right: Category Description */}
                      <div className="flex flex-col justify-center">
                        <Title level={4} className="mb-4">Waste Categories</Title>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                            <div>
                              <Text strong>Organic Waste (65%)</Text>
                              <Paragraph className="text-gray-500 m-0">
                                Agricultural waste, food scraps, and biodegradable materials.
                              </Paragraph>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-indigo-500 mr-2"></div>
                            <div>
                              <Text strong>Non-Organic Waste (35%)</Text>
                              <Paragraph className="text-gray-500 m-0">
                                Plastics, metals, and other non-biodegradable materials.
                              </Paragraph>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Final;
