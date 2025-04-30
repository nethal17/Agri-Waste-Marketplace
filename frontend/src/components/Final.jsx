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
  const [orderHistoryTotal, setOrderHistoryTotal] = useState(0);

  useEffect(() => {
    const fetchAndCalculateTotals = async () => {
      try {
        // Fetch all order history data
        const orderHistoryResponse = await axios.get('http://localhost:3000/api/order-history');
        const orderHistoryData = orderHistoryResponse.data;
        const orderHistoryCount = orderHistoryData.length;
        const orderHistoryTotal = orderHistoryCount * 1000;
        setOrderHistoryTotal(orderHistoryTotal);

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
        
        
        
        setMonthlyData(monthlyData);
        
        
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data. Please try again later.');
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
                        title={<span className="text-gray-600">Delivary Payments</span>}
                        value={orderHistoryTotal}
                        precision={2}
                        prefix={<TeamOutlined className="text-purple-500" />}
                        suffix="Rs."
                        valueStyle={{ color: '#8b5cf6', fontSize: '24px' }}
                      />
                      <div className="mt-2 flex items-center">
                        <ClockCircleOutlined className="text-purple-500 mr-1" />
                        <span className="text-purple-500 text-sm">Total from orders</span>
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
                    {/* Outcomes Section */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className="w-2 h-8 bg-red-500 rounded mr-2"></div>
                        <Title level={4} className="m-0 text-red-600">Outcomes</Title>
                      </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: Driver Salary */}
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

                        {/* Right: Farmer Payments */}
                        <div className="border-b border-gray-200 pb-4">
                          <div className="flex items-center mb-2">
                            <UserOutlined className="text-2xl text-blue-600 mr-2" />
                            <Title level={4} className="m-0">Farmer Payments </Title>
                          </div>
                          <div className="flex items-baseline">
                            <Text className="text-3xl font-bold text-blue-600">Rs. <CountUp end={farmerPayment} duration={2} separator="," decimal="." /></Text>
                            <Tag color="blue" className="ml-2">80%</Tag>
                          </div>
                          <Paragraph className="text-gray-500 mt-2">
                            Payments to farmers for their agricultural waste products.
                          </Paragraph>
                        </div>
                        </div>
                      </div>

                    {/* Incomes Section */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className="w-2 h-8 bg-green-500 rounded mr-2"></div>
                        <Title level={4} className="m-0 text-green-600">Incomes</Title>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: Delivery Payments */}
                        <div className="border-b border-gray-200 pb-4">
                          <div className="flex items-center mb-2">
                            <HistoryOutlined className="text-2xl text-indigo-600 mr-2" />
                            <Title level={4} className="m-0">Delivery Payments</Title>
                          </div>
                          <div className="flex items-baseline">
                            <Text className="text-3xl font-bold text-indigo-600">Rs. <CountUp end={orderHistoryTotal} duration={2} separator="," decimal="." /></Text>
                            <Tag color="indigo" className="ml-2">Shipping</Tag>
                          </div>
                          <Paragraph className="text-gray-500 mt-2">
                            Total revenue from delivery services.
                          </Paragraph>
                        </div>

                        {/* Right: Net Profit */}
                        <div className="border-b border-gray-200 pb-4">
                          <div className="flex items-center mb-2">
                            <RiseOutlined className="text-2xl text-yellow-600 mr-2" />
                            <Title level={4} className="m-0">Profit from selling products</Title>
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

                    {/* Total Profit Section */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                        <div className="w-2 h-8 bg-green-600 rounded mr-2"></div>
                        <Title level={4} className="m-0 text-green-700">Total Profit</Title>
                        </div>
                      <div className="flex items-baseline">
                        <Text className="text-4xl font-bold text-green-700">Rs. <CountUp end={orderHistoryTotal + profit} duration={2} separator="," decimal="." /></Text>
                        <Tag color="green" className="ml-2">Shipping fees & Profit from selling products</Tag>
                      </div>
                      <Paragraph className="text-gray-600 mt-2">
                        Combined total of Delivery Payments and Net Profit.
                      </Paragraph>
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
