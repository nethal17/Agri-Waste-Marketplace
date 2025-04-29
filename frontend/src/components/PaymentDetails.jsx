import React, { useState, useEffect } from 'react';
import { Navbar } from "./Navbar";
import Sidebar from "./Sidebar";
import { 
  Table, 
  Card, 
  Input, 
  Button, 
  DatePicker, 
  Space, 
  Tag, 
  Statistic, 
  Row, 
  Col, 
  Spin,
  message
} from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

const PaymentDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    averageAmount: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch all payments from Stripe
      const response = await axios.get('http://localhost:3000/api/stripe-payments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transform the data to match our table structure
      const transformedPayments = response.data.map(payment => ({
        key: payment._id || payment.id, // Use as key for table rows
        productName: payment.productName || 'Unknown Product',
        category: payment.category || 'Unknown Category',
        quantity: payment.quantity || 1,
        amount: payment.payAmount || 0,
        createdAt: payment.createdAt || new Date().toISOString(),
        status: payment.status || 'completed'
      }));

      console.log('Transformed payments:', transformedPayments); // Debug log

      setPayments(transformedPayments);
      setFilteredPayments(transformedPayments);
      
      // Calculate statistics
      const totalAmount = transformedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
      setStats({
        totalPayments: transformedPayments.length,
        totalAmount: totalAmount,
        averageAmount: totalAmount / (transformedPayments.length || 1)
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please login again');
        navigate('/login');
      } else {
        message.error('Failed to fetch payment data');
      }
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

    // Filter by search text
    if (searchValue) {
      filtered = filtered.filter(payment => 
        payment.productName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        payment.category?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Filter by date range
    if (dates && dates[0] && dates[1]) {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= dates[0].startOf('day') && 
               paymentDate <= dates[1].endOf('day');
      });
    }

    setFilteredPayments(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      ['Product', 'Category', 'Quantity', 'Amount', 'Date', 'Status'],
      ...filteredPayments.map(payment => [
        payment.productName,
        payment.category,
        payment.quantity,
        payment.amount,
        new Date(payment.createdAt).toLocaleDateString(),
        payment.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'payment_history.csv';
    link.click();
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category) => (
        <Tag color={category === 'Organic' ? 'green' : 'blue'}>
          {category}
        </Tag>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount) => `Rs. ${amount.toLocaleString()}`,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    }
  ];

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto ml-64"> {/* Added ml-64 to prevent sidebar overlay */}
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment History</h1>
              <p className="text-gray-600">View and manage your payment transactions</p>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} sm={8}>
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <Statistic
                    title="Total Payments"
                    value={stats.totalPayments}
                    prefix={<ShoppingCartOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <Statistic
                    title="Total Amount"
                    value={stats.totalAmount}
                    prefix={<DollarOutlined />}
                    suffix="Rs."
                    precision={2}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <Statistic
                    title="Average Amount"
                    value={stats.averageAmount}
                    prefix={<DollarOutlined />}
                    suffix="Rs."
                    precision={2}
                  />
                </Card>
              </Col>
            </Row>

            {/* Search and Filter Section */}
            <Card className="mb-8 shadow-md">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full">
                  <Input
                    placeholder="Search by product name or category"
                    prefix={<SearchOutlined />}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <RangePicker
                    onChange={handleDateRangeChange}
                    className="w-full md:w-auto"
                  />
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    className="w-full md:w-auto"
                  >
                    Export
                  </Button>
                </div>
              </div>
            </Card>

            {/* Payments Table */}
            <Card className="shadow-md">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spin size="large" />
                </div>
              ) : filteredPayments.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={filteredPayments}
                  rowKey="key"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} payments`,
                  }}
                  scroll={{ x: 1000 }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <ShoppingCartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <p className="text-lg">No payment records found</p>
                  <p className="text-sm">Try adjusting your search or date filters</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentDetails;