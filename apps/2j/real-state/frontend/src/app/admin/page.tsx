/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { PropertySubmission } from '../../types/property-submission';
import { isAdmin } from '../../lib/user-roles';

// Mock data for property submissions
const mockSubmissions: PropertySubmission[] = [
  {
    id: '1',
    title: 'Шинэ орон сууц Сүхбаатар дүүрэгт',
    price: 180000000,
    location: 'Сүхбаатар дүүрэг, Чингисийн өргөн чөлөө',
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    type: 'apartment',
    images: ['/api/placeholder/400/300'],
    description: 'Орчин үеийн дизайнтай шинэ орон сууц',
    submittedBy: 'user_123',
    submittedByEmail: 'user@example.com',
    submittedByName: 'Батбаяр',
    status: 'pending',
    submittedAt: '2024-01-15T10:00:00Z',
    owner: 'Батбаяр',
    phone: '+976 11 123456',
    yearBuilt: 2023,
    windows: 6,
    windowType: 'Дулаан цонх',
    doorType: 'Металл хаалга',
    floor: 3,
    buildingFloors: 8,
    floorType: 'Паркет',
    elevator: true,
  },
  {
    id: '2',
    title: 'Гэр бүлийн байшин Баянзүрхэд',
    price: 250000000,
    location: 'Баянзүрх дүүрэг, 5-р хороо',
    bedrooms: 4,
    bathrooms: 3,
    area: 150,
    type: 'house',
    images: ['/api/placeholder/400/300'],
    description: 'Том цэнгэлдэх хүрээлэнтэй гэр бүлийн байшин',
    submittedBy: 'user_456',
    submittedByEmail: 'seller@example.com',
    submittedByName: 'Сүхбаатар',
    status: 'approved',
    submittedAt: '2024-01-10T14:30:00Z',
    reviewedAt: '2024-01-12T09:15:00Z',
    reviewedBy: 'admin@realestate.mn',
    owner: 'Сүхбаатар',
    phone: '+976 11 234567',
    yearBuilt: 2022,
    windows: 10,
    windowType: 'Дулаан цонх',
    doorType: 'Модон хаалга',
    floor: 1,
    buildingFloors: 1,
    floorType: 'Паркет',
    elevator: false,
  },
  {
    id: '3',
    title: 'Оффисын байр төвд',
    price: 320000000,
    location: 'Сүхбаатар дүүрэг, Энхтайваны өргөн чөлөө',
    bedrooms: 0,
    bathrooms: 2,
    area: 120,
    type: 'commercial',
    images: ['/api/placeholder/400/300'],
    description: 'Хотын төвд байрлах худалдааны талбай',
    submittedBy: 'user_789',
    submittedByEmail: 'business@example.com',
    submittedByName: 'Энхбаяр',
    status: 'rejected',
    submittedAt: '2024-01-08T16:45:00Z',
    reviewedAt: '2024-01-09T11:20:00Z',
    reviewedBy: 'admin@realestate.mn',
    rejectionReason: 'Зураг дутуу, нэмэлт мэдээлэл шаардлагатай',
    owner: 'Энхбаяр',
    phone: '+976 11 345678',
    yearBuilt: 2021,
    windows: 4,
    windowType: 'Витрин цонх',
    doorType: 'Шилэн хаалга',
    floor: 1,
    buildingFloors: 3,
    floorType: 'Цемент',
    elevator: true,
  },
];

const AdminDashboard = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<PropertySubmission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<PropertySubmission | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      if (!isAdmin(user.primaryEmailAddress?.emailAddress || '')) {
        router.push('/');
        return;
      }
    }
  }, [isLoaded, user, router]);

  const handleApprove = (submissionId: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            status: 'approved' as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: user?.primaryEmailAddress?.emailAddress || 'admin'
          }
        : sub
    ));
    setShowModal(false);
  };

  const handleReject = (submissionId: string, reason: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            status: 'rejected' as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: user?.primaryEmailAddress?.emailAddress || 'admin',
            rejectionReason: reason
          }
        : sub
    ));
    setShowModal(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Зөвшөөрөгдсөн';
      case 'rejected':
        return 'Татгалзсан';
      default:
        return 'Хүлээгдэж буй';
    }
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin(user.primaryEmailAddress?.emailAddress || '')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Хандах эрх байхгүй</h1>
          <p className="text-gray-600">Та зөвхөн админ хэрэглэгчид энэ хуудсанд хандах боломжтой.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Админ панел</h1>
          </div>
          <p className="text-gray-600">Үл хөдлөх хөрөнгийн заруудыг удирдах</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Хүлээгдэж буй</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Зөвшөөрөгдсөн</p>
                <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Татгалзсан</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Үл хөдлөх хөрөнгийн зарууд</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Үл хөдлөх хөрөнгө
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Илгээгч
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Үнэ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Төлөв
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Огноо
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={submission.images[0]}
                            alt={submission.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{submission.title}</div>
                          <div className="text-sm text-gray-500">{submission.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{submission.submittedByName}</div>
                      <div className="text-sm text-gray-500">{submission.submittedByEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.price.toLocaleString()}₮
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(submission.status)}
                        <span className="ml-2 text-sm text-gray-900">
                          {getStatusText(submission.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(submission.submittedAt).toLocaleDateString('mn-MN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Харах
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Үл хөдлөх хөрөнгийн дэлгэрэнгүй</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Property Images */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Зураг</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedSubmission.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedSubmission.title} - ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                {/* Property Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Үндсэн мэдээлэл</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Гарчиг:</span>
                      <span className="font-medium">{selectedSubmission.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Байршил:</span>
                      <span className="font-medium">{selectedSubmission.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Үнэ:</span>
                      <span className="font-medium text-blue-600">{selectedSubmission.price.toLocaleString()}₮</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Талбай:</span>
                      <span className="font-medium">{selectedSubmission.area} м²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Өрөө:</span>
                      <span className="font-medium">{selectedSubmission.bedrooms} өрөө</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ариун цэврийн өрөө:</span>
                      <span className="font-medium">{selectedSubmission.bathrooms} өрөө</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Төрөл:</span>
                      <span className="font-medium">{selectedSubmission.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Тайлбар</h4>
                <p className="text-gray-700">{selectedSubmission.description}</p>
              </div>

              {/* Submission Info */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Илгээсэн мэдээлэл</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Илгээгч:</span>
                    <span className="font-medium">{selectedSubmission.submittedByName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Имэйл:</span>
                    <span className="font-medium">{selectedSubmission.submittedByEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Огноо:</span>
                    <span className="font-medium">{new Date(selectedSubmission.submittedAt).toLocaleString('mn-MN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Төлөв:</span>
                    <span className="font-medium">{getStatusText(selectedSubmission.status)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedSubmission.status === 'pending' && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedSubmission.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Зөвшөөрөх
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Татгалзах шалтгаан:');
                      if (reason) {
                        handleReject(selectedSubmission.id, reason);
                      }
                    }}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Татгалзах
                  </button>
                </div>
              )}

              {selectedSubmission.status === 'rejected' && selectedSubmission.rejectionReason && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                  <h5 className="font-semibold text-red-800 mb-2">Татгалзах шалтгаан:</h5>
                  <p className="text-red-700">{selectedSubmission.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
