'use client';
import ProtectedRoute from '../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { CgShoppingBag } from "react-icons/cg";
import { LuUser } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { BiChevronRight } from "react-icons/bi";
import { useAuth } from '../context/AuthContext';
import { LuPackage } from "react-icons/lu";
import Image from 'next/image';
import { TbLogout } from "react-icons/tb";
import { OrderSkeleton } from '../components/SkeletonLoader';

interface LineItem {
  title: string;
  quantity: number;
  variant: {
    price: string;
    compareAtPrice?: string;
  };
  lineTotal: string;
  imageUrl?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  totalPrice: string;
  currencyCode: string;
  createdAt: string;
  status: string;
  lineItems: LineItem[];
  shippingPrice?: string;
}

const formatPhoneNumber = (phone: string) => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for display (06 1234 5678)
  if (cleaned.length >= 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6, 10)}`;
  }
  
  return cleaned;
};

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [isLoading, setIsLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Update form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setOrdersLoading(true);
        setOrdersError(null);
        
        // Use the access token from user data
        if (!user.accessToken) {
          throw new Error('Please log in to view your orders');
        }

        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }

        if (!Array.isArray(data.orders)) {
          throw new Error('Invalid response format');
        }

        setOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrdersError(error instanceof Error ? error.message : 'Failed to fetch orders');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Format phone number as user types
    if (e.target.id === 'phone') {
      value = formatPhoneNumber(value);
    }

    setFormData({
      ...formData,
      [e.target.id]: value
    });
    
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          accessToken: user?.accessToken
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local user data
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUpdateSuccess(true);
    } catch (error) {
      console.error('Update error:', error);
      setUpdateError(error instanceof Error ? error.message : 'Bijwerken profiel mislukt');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value
    });
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handleUpdatePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);
    setIsPasswordLoading(true);

    try {
      // Validate passwords
      if (passwordData.newPassword.length < 8) {
        throw new Error('Wachtwoord moet minimaal 8 tekens lang zijn');
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Wachtwoorden komen niet overeen');
      }

      const response = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordData.newPassword,
          accessToken: user?.accessToken
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setPasswordSuccess(true);
      setPasswordData({ newPassword: '', confirmPassword: '' });

      // Show success message briefly before logout
      setTimeout(() => {
        logout(); // This will clear user data and redirect to login
      }, 1500);

    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Wachtwoord bijwerken mislukt');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-[1600px] mx-auto p-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Navigation */}
          <div className="lg:w-[300px]">
            <div className="sticky top-24 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="min-w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <LuUser className="text-2xl text-text" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-text truncate">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors text-text ${
                    activeTab === 'orders' ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CgShoppingBag className="text-xl" />
                    <span>Bestellingen</span>
                  </div>
                  <BiChevronRight className="text-xl" />
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors text-text ${
                    activeTab === 'settings' ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IoSettingsOutline className="text-xl" />
                    <span>Instellingen</span>
                  </div>
                  <BiChevronRight className="text-xl" />
                </button>
              </nav>

              {/* Logout Button */}
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 p-4 rounded-xl text-red-400 hover:bg-red-50 transition-colors"
              >
                <TbLogout className="text-xl" />
                <span>Uitloggen</span>
              </button>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1">
            {activeTab === 'orders' && (
              <div className="space-y-4 flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-text">Mijn Bestellingen</h1>
                
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <OrderSkeleton key={i} />
                    ))}
                  </div>
                ) : ordersError ? (
                  // Error state
                  <div className="text-center py-12 border rounded-2xl border-text/20">
                    <p className="text-red-400 mb-4">{ordersError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2 bg-accent text-text rounded-lg hover:bg-accent/70 transition-colors"
                    >
                      Probeer Opnieuw
                    </button>
                  </div>
                ) : orders.length === 0 ? (
                  // Empty state
                  <div className="text-center py-12 border rounded-2xl border-text/20">
                    <div className="flex justify-center mb-4">
                      <LuPackage className="text-4xl text-text/50" />
                    </div>
                    <h3 className="text-xl font-medium text-text mb-2">Nog geen bestellingen</h3>
                    <p className="text-gray-600 mb-6">
                      Wanneer je een bestelling plaatst, verschijnt deze hier.
                    </p>
                  </div>
                ) : (
                  // Orders list
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-text/20 rounded-2xl p-6 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-text">Bestelling #{order.orderNumber}</h3>
                            <p className="text-sm text-text/50">
                              Geplaatst op {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-[50px] text-sm ${
                            order.status.toLowerCase() === 'cancelled' || order.status.toLowerCase() === 'canceled'
                              ? 'bg-red-400 text-white'
                              : order.status.toLowerCase() === 'refunded'
                              ? 'bg-text text-white'
                              : order.status.toLowerCase() === 'unfulfilled' 
                              ? 'bg-accent text-text'
                              : order.status.toLowerCase() === 'completed'
                              ? 'bg-accent text-text'
                              : 'bg-accent text-text'
                          }`}>
                            {order.status.toLowerCase()}
                          </span>
                        </div>

                        {order.lineItems.map((item, index) => {
                          return (
                            <div key={index} className="flex gap-4">
                              <div className="w-20 h-20 bg-accent rounded-xl shrink-0 relative overflow-hidden">
                                <Image
                                  src={item.imageUrl || '/placeholder.jpg'}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-text">{item.title}</h3>
                                <p className="text-sm text-text/50">Aantal: {item.quantity}</p>
                                <div className="flex items-center gap-2">
                                  {item.variant.compareAtPrice && parseFloat(item.variant.compareAtPrice) > parseFloat(item.variant.price) && (
                                    <span className="text-sm line-through text-text/50">
                                      €{parseFloat(item.variant.compareAtPrice).toFixed(2)}
                                    </span>
                                  )}
                                  <span className={`font-medium ${
                                    item.variant.compareAtPrice && parseFloat(item.variant.compareAtPrice) > parseFloat(item.variant.price)
                                      ? 'text-red-400'
                                      : 'text-text'
                                  }`}>
                                <div className="mt-1 font-medium">
                                  €{item.lineTotal || (parseFloat(item.variant.price) * item.quantity).toFixed(2)}
                                </div>
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Fix shipping price display */}
                        <div className="pt-4 border-t border-text/20">
                          <div className="flex justify-between text-text mb-2">
                            <span>Verzendkosten</span>
                            {parseFloat(order.shippingPrice || "0") > 0 ? (
                              <span>€{parseFloat(order.shippingPrice || "0").toFixed(2)}</span>
                            ) : (
                              <span className="text-text">Gratis verzending</span>
                            )}
                          </div>
                          
                          <div className="flex justify-between text-text">
                            <span>Totaal</span>
                            <span className="font-bold">€{parseFloat(order.totalPrice).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4 flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-text">Account Instellingen</h1>
                
                <div className="border border-text/20 rounded-2xl p-6 space-y-6">
                  {updateError && (
                    <div className="bg-red-50 text-red-400 p-4 rounded-xl">
                      {updateError}
                    </div>
                  )}
                  
                  {updateSuccess && (
                    <div className="bg-green-50 text-green-500 p-4 rounded-xl">
                      Profiel succesvol bijgewerkt!
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-bold text-text">Persoonlijke Informatie</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block font-bold text-sm text-text">
                          VOORNAAM
                        </label>
                        <input 
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full border border-text/20 rounded-xl p-3 text-text focus:outline-none focus:border-text"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block font-bold text-sm text-text">
                          ACHTERNAAM
                        </label>
                        <input 
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full border border-text/20 rounded-xl p-3 text-text focus:outline-none focus:border-text"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block font-bold text-sm text-text">
                          E-MAILADRES
                        </label>
                        <input 
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-text/20 rounded-xl p-3 text-text focus:outline-none focus:border-text"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block font-bold text-sm text-text">
                          TELEFOONNUMMER (OPTIONEEL)
                        </label>
                        <input 
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="06 1234 5678"
                          className="w-full border border-text/20 rounded-xl p-3 text-text focus:outline-none focus:border-text placeholder:text-text/50"
                          pattern="[0-9\s]*"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveChanges}
                    disabled={isLoading}
                    className={`w-full bg-accent text-text rounded-[25px] p-3 hover:bg-accent/70 transition-colors ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Wijzigingen opslaan...' : 'Wijzigingen Opslaan'}
                  </button>
                </div>

                <div className="border border-text/20 rounded-2xl p-6 space-y-6">
                  {passwordError && (
                    <div className="bg-red-50 text-red-400 p-4 rounded-xl">
                      {passwordError}
                    </div>
                  )}
                  
                  {passwordSuccess && (
                    <div className="bg-green-50 text-green-500 p-4 rounded-xl">
                      Wachtwoord succesvol bijgewerkt! Je wordt zo uitgelogd...
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-bold text-text">Wachtwoord Wijzigen</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="block font-bold text-sm text-text">
                          NIEUW WACHTWOORD
                        </label>
                        <input 
                          type="password" 
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full border border-text/20 rounded-xl p-3 text-text focus:outline-none focus:border-text"
                          minLength={8}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block font-bold text-sm text-text">
                          BEVESTIG NIEUW WACHTWOORD
                        </label>
                        <input 
                          type="password" 
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full border border-text/20 rounded-xl p-3 text-text focus:outline-none focus:border-text"
                          minLength={8}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleUpdatePassword}
                    disabled={isPasswordLoading}
                    className={`w-full bg-accent text-text rounded-[25px] p-3 hover:bg-accent/70 transition-colors ${
                      isPasswordLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isPasswordLoading ? 'Bijwerken...' : 'Wachtwoord Bijwerken'}
                  </button>
                </div>

                <button 
                  onClick={logout}
                  className="w-full bg-red-400 text-white rounded-[25px] p-3 hover:bg-red-500 transition-colors"
                >
                  Uitloggen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 