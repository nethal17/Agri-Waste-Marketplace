import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Typography } from 'antd';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/Sidebar';

const { Title, Text, Paragraph } = Typography;

// Color constants
const CATEGORY_COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'];
const PAYMENT_COLORS = ['#10B981', '#6366F1'];

const Charts = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    monthlyData: [],
    categoryData: [],
    paymentData: []
  });

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setChartData({
        monthlyData: [
          { month: 'Jan', value: 1200 },
          { month: 'Feb', value: 1500 },
          { month: 'Mar', value: 1800 },
          { month: 'Apr', value: 2100 },
          { month: 'May', value: 2400 },
          { month: 'Jun', value: 2800 }
        ],
        categoryData: [
          { name: 'Organic Waste', value: 65 },
          { name: 'Non-Organic Waste', value: 35 }
        ],
        paymentData: [
          { name: 'Farmer Payments', value: 60 },
          { name: 'Driver Payments', value: 40 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 pt-16">
        <div className="p-8">
          <Title level={2} className="text-gray-800 mb-8">Analytics Dashboard</Title>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {/* Monthly Transactions Chart */}
              <Col xs={24} lg={12}>
                <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                    <Title level={3} className="text-white m-0">Monthly Transactions</Title>
                  </div>
                  <div className="p-6">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData.monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              </Col>
              
              {/* Category Distribution Chart */}
              <Col xs={24} lg={12}>
                <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 text-white">
                    <Title level={3} className="text-white m-0">Waste Category Distribution</Title>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData.categoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {chartData.categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
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
              </Col>
              
              {/* Payment Distribution Chart */}
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
                            data={chartData.paymentData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {chartData.paymentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts; 