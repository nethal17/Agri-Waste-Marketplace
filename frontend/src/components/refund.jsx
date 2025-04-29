import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Tag, message, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Navbar } from "./Navbar";
import Sidebar from "./Sidebar";

const Refund = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/refunds');
      setRefunds(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching refunds:', error);
      message.error('Failed to fetch refunds');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (refundId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/refunds/${refundId}/status`, {
        status: newStatus
      });
      message.success(`Refund request ${newStatus} successfully`);
      fetchRefunds(); // Refresh the list
    } catch (error) {
      console.error('Error updating refund status:', error);
      message.error('Failed to update refund status');
    }
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `Rs. ${price.toLocaleString()}`,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Canceled Date',
      dataIndex: 'canceledDate',
      key: 'canceledDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'refundStatus',
      key: 'refundStatus',
      render: (status) => {
        const color = status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Reason',
      dataIndex: 'refundReason',
      key: 'refundReason',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.refundStatus === 'pending' && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleStatusUpdate(record._id, 'approved')}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Accept
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleStatusUpdate(record._id, 'rejected')}
              >
                Decline
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50 ml-64">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Refund Management</h1>
              <p className="mt-2 text-gray-600">Manage and process refund requests from users</p>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <Table
                columns={columns}
                dataSource={refunds}
                loading={loading}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Refund; 