import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../components/Navbar";
import Sidebar from "./Sidebar";
import { 
  Table, 
  Card, 
  Button, 
  Tag, 
  Statistic, 
  Row, 
  Col, 
  Spin,
  DatePicker,
  Input,
  Space,
  Typography,
  Progress,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  DollarOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const PayHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stripe-payments');
        console.log('Full API Response:', response.data);
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format received from API');
        }
         
        const excludedNames = [
          'yuwani perera',
          'pasan perera',
          'bobee perera'
        ];

        const filteredPayments = response.data.filter(payment => {
          if (payment.payAmount >= 20000) return false;
          
          if (!payment.driverName) return true;
          const lowerCaseName = payment.driverName.toLowerCase();
          return !excludedNames.some(name => lowerCaseName.includes(name));
        });

        setPayments(filteredPayments);
      setFilteredPayments(filteredPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

  const handleSearch = (value) => {
    setSearchText(value);
    filterPayments(value, dateRange);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    filterPayments(searchText, dates);
  };

  const filterPayments = (searchValue, dates) => {
    let filtered = [...payments];

    if (searchValue) {
      filtered = filtered.filter(payment => 
        payment.driverName?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (dates && dates[0] && dates[1]) {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= dates[0].startOf('day') && 
               paymentDate <= dates[1].endOf('day');
      });
    }

    setFilteredPayments(filtered);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Buyer Name',
      dataIndex: 'driverName',
      key: 'driverName',
      width: 200,
      render: (text) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
            <span className="text-blue-600 font-semibold">
              {text ? text.charAt(0).toUpperCase() : 'N/A'}
            </span>
          </div>
          <span>{text || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Amount (Rs.)',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 150,
      render: (amount) => (
        <div className="flex items-center">
          <span className="font-semibold text-green-600">
            Rs. {amount ? amount.toFixed(2) : '0.00'}
          </span>
          {amount >= 20000 && (
            <Tag color="gold" className="ml-2">High Value</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 150,
      render: (date) => (
        <div className="flex items-center">
          <CalendarOutlined className="text-gray-400 mr-2" />
          <span className="text-gray-600">
            {date ? new Date(date).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: () => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Completed
        </Tag>
      ),
    }
  ];

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + (payment.payAmount || 0), 0);
  const averageAmount = totalAmount / (filteredPayments.length || 1);
  const highValuePayments = filteredPayments.filter(payment => payment.payAmount >= 20000).length;
  const highValuePercentage = (highValuePayments / (filteredPayments.length || 1)) * 100;

  // Prepare data for charts
  const monthlyData = filteredPayments.reduce((acc, payment) => {
    const date = new Date(payment.paymentDate);
    const month = date.toLocaleString('default', { month: 'short' });
    const existingMonth = acc.find(item => item.name === month);
    
    if (existingMonth) {
      existingMonth.amount += payment.payAmount || 0;
    } else {
      acc.push({ name: month, amount: payment.payAmount || 0 });
    }
    
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <Title level={2} className="text-3xl font-bold text-gray-800 mb-2">
        Product Payment Transactions
              </Title>
              <Text className="text-gray-600">
                View and manage all payment transactions
              </Text>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} sm={12} lg={6}>
                <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                  <Statistic
                    title={<span className="text-gray-600">Total Transactions</span>}
                    value={filteredPayments.length}
                    prefix={<ShoppingCartOutlined className="text-blue-500" />}
                    valueStyle={{ color: '#3b82f6' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100 border-0">
                  <Statistic
                    title={<span className="text-gray-600">Total Amount</span>}
                    value={totalAmount}
                    prefix={<DollarOutlined className="text-green-500" />}
                    suffix="Rs."
                    precision={2}
                    valueStyle={{ color: '#10b981' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                  <Statistic
                    title={<span className="text-gray-600">Average Amount</span>}
                    value={averageAmount}
                    prefix={<DollarOutlined className="text-purple-500" />}
                    suffix="Rs."
                    precision={2}
                    valueStyle={{ color: '#8b5cf6' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                
              </Col>
            </Row>

            {/* Charts Section */}
            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <div className="flex items-center">
                      <BarChartOutlined className="text-blue-500 mr-2" />
                      <span>Monthly Transactions</span>
                    </div>
                  }
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
              
            </Row>

            {/* Search and Filter Section */}
            <Card className="mb-8 shadow-md bg-gradient-to-r from-gray-50 to-gray-100 border-0">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full">
                  <Input
                    placeholder="Search by buyer name"
                    prefix={<SearchOutlined className="text-gray-400" />}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <RangePicker
                    onChange={handleDateRangeChange}
                    className="w-full md:w-auto"
                  />
          </div>
        </div>
            </Card>

            {/* Payments Table */}
            <Card className="shadow-md">
              {filteredPayments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <ShoppingCartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <p className="text-lg">No payment records found</p>
                  <p className="text-sm">Try adjusting your search or date filters</p>
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={filteredPayments}
                  rowKey={(record) => record.id || Math.random()}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} payments`,
                  }}
                  scroll={{ x: 1000 }}
                  className="custom-table"
                />
              )}
            </Card>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button
                type="primary"
          onClick={() => navigate('/high-payments')}
                className="bg-green-600 hover:bg-green-700 h-10"
                icon={<ArrowUpOutlined />}
        >
          Driver Paid Salaries
              </Button>
              <Button
          onClick={() => navigate('/')}
                className="bg-gray-600 hover:bg-gray-700 text-white h-10"
                icon={<ArrowDownOutlined />}
        >
          Back to Driver List
              </Button>
              <Button
  onClick={() => navigate('/final-summary')}
                className="bg-purple-600 hover:bg-purple-700 text-white h-10"
                icon={<LineChartOutlined />}
>
  View Total Payments
              </Button>
            </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default PayHistory;