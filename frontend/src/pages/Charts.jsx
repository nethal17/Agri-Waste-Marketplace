import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Typography, Statistic } from 'antd';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarOutlined, UserOutlined, TeamOutlined, RiseOutlined } from '@ant-design/icons';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const Charts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [highTotalAmount, setHighTotalAmount] = useState(0);
  const [orderHistoryTotal, setOrderHistoryTotal] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order history data
        const orderHistoryResponse = await axios.get('http://localhost:3000/api/order-history');
        const orderHistoryData = orderHistoryResponse.data;
        const orderHistoryCount = orderHistoryData.length;
        const orderHistoryTotal = orderHistoryCount * 1000;
        setOrderHistoryTotal(orderHistoryTotal);

        // Fetch stripe payments
        const paymentsResponse = await axios.get('http://localhost:3000/api/stripe-payments');
        const payments = paymentsResponse.data;

        const total = payments.reduce((sum, payment) => {
          const amount = parseFloat(payment.payAmount) || 0;
          return sum + amount;
        }, 0);

        const highTotal = payments.reduce((sum, payment) => {
          const amount = parseFloat(payment.payAmount) || 0;
          return amount >= 20000 ? sum + amount : sum;
        }, 0);

        setTotalAmount(total);
        setHighTotalAmount(highTotal);

        // Generate monthly data for the line chart
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
          const month = new Date(2024, i, 1).toLocaleString('default', { month: 'short' });
          const baseValue = total / 12;
          const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
          return {
            month,
            value: Math.round(baseValue * randomFactor)
          };
        });
        setMonthlyData(monthlyData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const farmerPayment = totalAmount * 0.8;
  const profit = totalAmount * 0.2;

  // Calculate total outcomes (Driver Salary + Farmer Payments)
  const totalOutcomes = highTotalAmount + farmerPayment;

  // Calculate total income (Delivery Payments + Profit)
  const totalIncome = orderHistoryTotal + profit;

  const pieData = [
    { name: 'Total Income', value: totalIncome },
    { name: 'Total Outcomes', value: totalOutcomes }
  ];

  const paymentComparisonData = [
    { name: 'Farmer Payments', value: farmerPayment },
    { name: 'Driver Payments', value: highTotalAmount }
  ];

  const COLORS = ['#10B981', '#EF4444']; // Green for income, Red for outcomes
  const PAYMENT_COLORS = ['#3b82f6', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 pt-16 flex items-center justify-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 pt-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 pt-16">
        <div className="p-8">
          <Title level={2} className="text-gray-800 mb-8">Financial Analytics Dashboard</Title>
          
          <Row gutter={[24, 24]}>
            {/* Summary Cards */}
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
                  <span className="text-purple-500 text-sm">Monthly salary</span>
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
                  <span className="text-yellow-500 text-sm">20% of revenue</span>
                </div>
              </Card>
            </Col>

            {/* Revenue Distribution Pie Chart */}
            <Col xs={24} lg={12}>
              <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                  <Title level={3} className="text-white m-0">Income vs Outcomes</Title>
                </div>
                <div className="p-6">
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
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <Text strong className="text-green-600">Total Income</Text>
                      <Paragraph className="text-gray-600 m-0">
                        Rs. {totalIncome.toFixed(2)}
                      </Paragraph>
                      <div className="mt-2 text-sm text-gray-500">
                        <div>Delivery Payments: Rs. {orderHistoryTotal.toFixed(2)}</div>
                        <div>Profit: Rs. {profit.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <Text strong className="text-red-600">Total Outcomes</Text>
                      <Paragraph className="text-gray-600 m-0">
                        Rs. {totalOutcomes.toFixed(2)}
                      </Paragraph>
                      <div className="mt-2 text-sm text-gray-500">
                        <div>Driver Salary: Rs. {highTotalAmount.toFixed(2)}</div>
                        <div>Farmer Payments: Rs. {farmerPayment.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Payment Comparison Pie Chart */}
            <Col xs={24} lg={12}>
              <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
                  <Title level={3} className="text-white m-0">Payment Distribution</Title>
                </div>
                <div className="p-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentComparisonData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {paymentComparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <Text strong className="text-blue-600">Farmer Payments</Text>
                      <Paragraph className="text-gray-600 m-0">
                        Rs. {farmerPayment.toFixed(2)}
                      </Paragraph>
                    </div>
                    <div className="text-center">
                      <Text strong className="text-purple-600">Driver Payments</Text>
                      <Paragraph className="text-gray-600 m-0">
                        Rs. {highTotalAmount.toFixed(2)}
                      </Paragraph>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Monthly Revenue Trend Line Chart */}
            <Col xs={24} lg={12}>
              <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 text-white">
                  <Title level={3} className="text-white m-0">Monthly Revenue Trend</Title>
                </div>
                <div className="p-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          name="Revenue"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Charts; 