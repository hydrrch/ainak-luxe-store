"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Package,
  TrendingUp,
  Users,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Check,
  Eye,
  Sliders,
  DollarSign,
  Glasses,
  X,
  FileText,
  Layers,
  ExternalLink,
  Sparkles,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "stock" | "lenses">("overview");

  // Metrics state
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [lenses, setLenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [productSearch, setProductSearch] = useState("");

  // Edit / Status Modals
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [newTrackingNumber, setNewTrackingNumber] = useState("");
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [previewRxImage, setPreviewRxImage] = useState<string | null>(null);

  // Lens Management Modal State
  const [isLensModalOpen, setIsLensModalOpen] = useState(false);
  const [editingLens, setEditingLens] = useState<any | null>(null);
  const [lensName, setLensName] = useState("");
  const [lensType, setLensType] = useState("SINGLE_VISION");
  const [lensPrice, setLensPrice] = useState("");
  const [lensDesc, setLensDesc] = useState("");
  const [lensFeatures, setLensFeatures] = useState("");
  const [lensIsActive, setLensIsActive] = useState(true);
  const [isSavingLens, setIsSavingLens] = useState(false);

  // New Product Modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdSku, setNewProdSku] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdBrandId, setNewProdBrandId] = useState("");
  const [newProdCategoryId, setNewProdCategoryId] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdSalePrice, setNewProdSalePrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("15");
  const [newProdShape, setNewProdShape] = useState("WAYFARER");
  const [newProdOverlay, setNewProdOverlay] = useState("/glasses/wayfarer-black.svg");
  const [newProdImage, setNewProdImage] = useState("");
  const [isSavingProd, setIsSavingProd] = useState(false);

  // Quick edit product stock/price inline
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  // Load Admin Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, lensesRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/products"),
        fetch("/api/admin/lenses"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }
      if (productsRes.ok) {
        const prodsData = await productsRes.json();
        setProducts(prodsData.products || []);
        setBrands(prodsData.brands || []);
        setCategories(prodsData.categories || []);
        if (prodsData.brands?.length > 0) setNewProdBrandId(prodsData.brands[0].id);
        if (prodsData.categories?.length > 0) setNewProdCategoryId(prodsData.categories[0].id);
      }
      if (lensesRes.ok) {
        const lensesData = await lensesRes.json();
        setLenses(lensesData.lenses || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/admin/login");
      } else if (user.role !== "ADMIN") {
        router.push("/");
      } else {
        loadDashboardData();
      }
    }
  }, [user, authLoading, router]);

  // Handle Order Status Update
  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdatingOrder(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          orderStatus: newOrderStatus,
          paymentStatus: newPaymentStatus,
          trackingNumber: newTrackingNumber || null,
        }),
      });
      if (res.ok) {
        await loadDashboardData();
        setSelectedOrder(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Lens Management Handlers
  const openCreateLens = () => {
    setEditingLens(null);
    setLensName("");
    setLensType("SINGLE_VISION");
    setLensPrice("");
    setLensDesc("");
    setLensFeatures("");
    setLensIsActive(true);
    setIsLensModalOpen(true);
  };

  const openEditLens = (lens: any) => {
    setEditingLens(lens);
    setLensName(lens.name);
    setLensType(lens.type);
    setLensPrice(lens.price.toString());
    setLensDesc(lens.description || "");
    setLensFeatures(lens.features || "");
    setLensIsActive(lens.isActive);
    setIsLensModalOpen(true);
  };

  const handleSaveLens = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLens(true);
    try {
      const isEdit = Boolean(editingLens);
      const url = "/api/admin/lenses";
      const method = isEdit ? "PUT" : "POST";
      const payload: any = {
        name: lensName,
        type: lensType,
        price: lensPrice,
        description: lensDesc,
        features: lensFeatures,
        isActive: lensIsActive,
      };
      if (isEdit) {
        payload.id = editingLens.id;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await loadDashboardData();
        setIsLensModalOpen(false);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to save optical lens option");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingLens(false);
    }
  };

  const handleToggleLensActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/lenses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentActive }),
      });
      if (res.ok) {
        await loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLens = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove or deactivate lens "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/lenses?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle New Product Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProd(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProdName,
          sku: newProdSku,
          description: newProdDesc,
          brandId: newProdBrandId,
          categoryId: newProdCategoryId,
          basePrice: newProdPrice,
          salePrice: newProdSalePrice || null,
          stockCount: newProdStock,
          frameShape: newProdShape,
          virtualTryOnOverlay: newProdOverlay,
          imageUrl: newProdImage,
        }),
      });
      if (res.ok) {
        await loadDashboardData();
        setIsAddProductOpen(false);
        setNewProdName("");
        setNewProdSku("");
        setNewProdDesc("");
        setNewProdPrice("");
        setNewProdSalePrice("");
        setNewProdImage("");
      } else {
        const d = await res.json();
        alert(d.error || "Failed to create product");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingProd(false);
    }
  };

  // Handle Quick Edit Save
  const handleSaveQuickEdit = async (productId: string) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          basePrice: editPrice,
          stockCount: editStock,
        }),
      });
      if (res.ok) {
        await loadDashboardData();
        setEditingProductId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-semibold">Authenticating administrative session...</p>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !orderSearch ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchesStatus =
      orderStatusFilter === "ALL" || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    return (
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand?.name?.toLowerCase().includes(productSearch.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Banner */}
      <div className="bg-gray-950 text-white p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center text-white shadow-md">
            <ShieldAlert className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-900 text-brand-200 px-2 py-0.5 rounded border border-brand-700">
                Super Administrator
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Database Connected
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1">
              Ainak Luxe Management Center
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-colors"
          >
            Storefront View
          </Link>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add New Eyewear
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-3 px-5 rounded-t-xl transition-all ${
            activeTab === "overview"
              ? "bg-white text-brand-700 border-t-2 border-brand-700 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Metrics Overview
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`py-3 px-5 rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === "orders"
              ? "bg-white text-brand-700 border-t-2 border-brand-700 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <span>Orders Management</span>
          <span className="bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full text-[10px]">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`py-3 px-5 rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === "products"
              ? "bg-white text-brand-700 border-t-2 border-brand-700 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <span>Catalogue & Inventory</span>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px]">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("stock")}
          className={`py-3 px-5 rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === "stock"
              ? "bg-white text-brand-700 border-t-2 border-brand-700 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <span>Low-Stock Alerts</span>
          {stats?.metrics?.lowStockCount > 0 && (
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px]">
              {stats.metrics.lowStockCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("lenses")}
          className={`py-3 px-5 rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === "lenses"
              ? "bg-white text-brand-700 border-t-2 border-brand-700 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <span>Optical Lenses & Glazing</span>
          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-[10px]">
            {lenses.length}
          </span>
        </button>
      </div>

      {/* Tab: Overview Metrics */}
      {activeTab === "overview" && stats && (
        <div className="space-y-8 animate-in fade-in-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Revenue
              </span>
              <div className="text-2xl font-extrabold text-brand-700">
                {formatPrice(stats.metrics.totalRevenue)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">
                ✓ Delivered & Pending COD
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Orders
              </span>
              <div className="text-2xl font-extrabold text-gray-900">
                {stats.metrics.totalOrders}
              </div>
              <span className="text-[11px] text-gray-500">Across all Pakistani cities</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Registered Customers
              </span>
              <div className="text-2xl font-extrabold text-gray-900">
                {stats.metrics.totalCustomers}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">
                Active customer profiles
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Low Stock Warning
              </span>
              <div className="text-2xl font-extrabold text-amber-600">
                {stats.metrics.lowStockCount} frames
              </div>
              <span className="text-[11px] text-gray-500">Inventory &lt;= 10 units</span>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
              Recent Customer Orders
            </h3>
            <div className="divide-y divide-gray-100">
              {stats.recentOrders.map((ord: any) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-gray-900">{ord.orderNumber}</span>
                    <span className="text-gray-500 ml-2">by {ord.customerName} ({ord.city})</span>
                    <span className="text-gray-400 block text-[11px]">{formatDate(ord.createdAt)}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-brand-700">{formatPrice(ord.total)}</span>
                    <span className="block text-[10px] font-semibold text-gray-500 uppercase">{ord.orderStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Orders Management */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by order #, customer, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing / Glazing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-y">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No orders matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const hasRxSlip = ord.items?.some((it: any) => Boolean(it.prescriptionImage));
                    const hasRxNumbers = ord.items?.some((it: any) => Boolean(it.prescriptionOD || it.prescriptionOS));
                    const hasWhatsApp = ord.items?.some((it: any) => it.prescriptionMethod === "WHATSAPP");

                    return (
                      <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900">{ord.customerName}</div>
                          <div className="text-[11px] text-gray-400">{ord.customerPhone}</div>
                          {/* Prescription Badges */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {hasRxSlip && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                                📸 Rx Slip Uploaded
                              </span>
                            )}
                            {hasRxNumbers && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded border border-blue-300">
                                ✍️ Custom Rx Numbers
                              </span>
                            )}
                            {hasWhatsApp && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-300">
                                📱 WhatsApp Rx
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          <div>{ord.city}</div>
                          <div className="text-[10px] text-gray-400">{ord.items?.length || 0} frame(s)</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-brand-700">
                          {formatPrice(ord.total)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-700">{ord.paymentMethod}</span>
                          <span className="block text-[10px] text-gray-400">{ord.paymentStatus}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setNewOrderStatus(ord.orderStatus);
                              setNewPaymentStatus(ord.paymentStatus);
                              setNewTrackingNumber(ord.trackingNumber || "");
                            }}
                            className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect & Glaze</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Products Catalogue */}
      {activeTab === "products" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by title, SKU, brand..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Frame
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-y">
                <tr>
                  <th className="py-3 px-4">Frame</th>
                  <th className="py-3 px-4">SKU / Brand</th>
                  <th className="py-3 px-4">Shape</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Inventory</th>
                  <th className="py-3 px-4">Try-On Asset</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const isEditing = editingProductId === p.id;
                  const thumb = p.images?.[0]?.url || "/glasses/wayfarer-black.svg";

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border p-1 shrink-0 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={thumb} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{p.name}</div>
                          <div className="text-[11px] text-gray-400 capitalize">{p.category?.name}</div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-gray-700 font-semibold">{p.sku}</span>
                        <span className="block text-[11px] text-gray-400">{p.brand?.name}</span>
                      </td>

                      <td className="py-3 px-4 capitalize text-gray-600">
                        {p.frameShape.toLowerCase()}
                      </td>

                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24 p-1 border rounded text-xs"
                          />
                        ) : (
                          <span className="font-bold text-brand-700">{formatPrice(p.basePrice)}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="w-16 p-1 border rounded text-xs"
                          />
                        ) : (
                          <span
                            className={`font-semibold ${
                              p.stockCount <= 5 ? "text-amber-600" : "text-gray-800"
                            }`}
                          >
                            {p.stockCount} units
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[11px] font-mono text-gray-500 truncate max-w-[120px]">
                        {p.virtualTryOnOverlay || "None"}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveQuickEdit(p.id)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProductId(p.id);
                              setEditPrice(p.basePrice.toString());
                              setEditStock(p.stockCount.toString());
                            }}
                            className="p-1.5 text-gray-500 hover:text-brand-700"
                            title="Quick Edit Price & Stock"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Low Stock */}
      {activeTab === "stock" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4 animate-in fade-in-50">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-extrabold text-base">Low Inventory Eyewear Products</h3>
          </div>
          <p className="text-xs text-gray-500">
            Frames requiring supplier reorder or workshop assembly.
          </p>

          <div className="divide-y divide-gray-100">
            {stats?.lowStockProducts?.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-900">{item.name}</span>
                  <span className="font-mono text-gray-400 ml-2">SKU: {item.sku}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-amber-600">{item.stockCount} units remaining</span>
                  <span className="block text-[11px] text-gray-400">{formatPrice(item.basePrice)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Optical Lenses & Glazing Management */}
      {activeTab === "lenses" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                  Optical Laboratory
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {lenses.length} Active & Catalogued Lens Tiers
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mt-1">
                Prescription Lens Catalog & Glazing Pricing
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Configure lens options presented to customers during frame checkout (Blue Cut, Transitions, Progressives, Anti-Glare).
              </p>
            </div>

            <button
              onClick={openCreateLens}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Optical Lens Option
            </button>
          </div>

          {/* Lenses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lenses.map((lens) => {
              const featuresList = lens.features
                ? lens.features.split(",").map((f: string) => f.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={lens.id}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                    lens.isActive
                      ? "bg-white border-gray-200 hover:border-brand-700 hover:shadow-md"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {lens.type}
                        </span>
                        <h4 className="font-extrabold text-sm text-gray-900 mt-1">
                          {lens.name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-brand-700 text-base">
                          {formatPrice(lens.price)}
                        </span>
                      </div>
                    </div>

                    {lens.description && (
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {lens.description}
                      </p>
                    )}

                    {featuresList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {featuresList.map((feat: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold bg-brand-50 text-brand-800 px-2 py-0.5 rounded-full border border-brand-100"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-brand-600" />
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleLensActive(lens.id, lens.isActive)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                          lens.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
                        }`}
                      >
                        {lens.isActive ? "● Active on Store" : "○ Disabled"}
                      </button>
                      {lens._count?.orderItems > 0 && (
                        <span className="text-[10px] text-gray-400 font-medium">
                          {lens._count.orderItems} orders
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditLens(lens)}
                        className="p-1.5 text-gray-500 hover:text-brand-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Lens Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLens(lens.id, lens.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Lens"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Comprehensive Order & Prescription Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg">
                    {selectedOrder.orderNumber}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-0.5 rounded-full">
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-gray-900 mt-1">
                  Order & Prescription Inspection
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Delivery Information */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block text-[10px]">
                  Customer Details
                </span>
                <p className="font-extrabold text-gray-900 text-sm mt-0.5">
                  {selectedOrder.customerName}
                </p>
                <p className="text-gray-600 mt-1 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-brand-700" />
                  <a href={`tel:${selectedOrder.customerPhone}`} className="hover:underline font-mono">
                    {selectedOrder.customerPhone}
                  </a>
                  <a
                    href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded hover:bg-emerald-200 ml-1"
                  >
                    WhatsApp
                  </a>
                </p>
                {selectedOrder.customerEmail && (
                  <p className="text-gray-600 mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-brand-700" />
                    {selectedOrder.customerEmail}
                  </p>
                )}
              </div>

              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block text-[10px]">
                  Delivery Address & Payment
                </span>
                <p className="text-gray-700 mt-0.5">
                  {selectedOrder.shippingAddress}
                </p>
                <p className="text-gray-900 font-semibold mt-0.5">
                  {selectedOrder.city}, {selectedOrder.province}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-bold text-brand-700">
                    {formatPrice(selectedOrder.total)}
                  </span>
                  <span className="text-[10px] font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                    {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                  </span>
                </div>
              </div>
            </div>

            {/* Ordered Frames & Optical Prescriptions */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                <Glasses className="w-4 h-4 text-brand-700" />
                <span>Frames & Prescription Glazing Details ({selectedOrder.items?.length || 0})</span>
              </h4>

              <div className="space-y-4">
                {selectedOrder.items?.map((item: any, idx: number) => {
                  let rxJson = null;
                  if (item.prescriptionDetails) {
                    try {
                      rxJson = JSON.parse(item.prescriptionDetails);
                    } catch {
                      rxJson = null;
                    }
                  }

                  const hasSlip = Boolean(item.prescriptionImage);
                  const hasNumbers = Boolean(item.prescriptionOD || item.prescriptionOS || rxJson?.sphereOD);
                  const isWhatsApp = item.prescriptionMethod === "WHATSAPP";
                  const isPlano = item.prescriptionMethod === "ZERO_POWER";

                  return (
                    <div
                      key={item.id || idx}
                      className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-3"
                    >
                      {/* Frame & Lens Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                        <div>
                          <span className="font-extrabold text-sm text-gray-900">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="font-mono text-gray-400 text-xs ml-2">
                            SKU: {item.productSku}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-brand-700 text-sm">
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      </div>

                      {/* Selected Lens Glazing */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-gray-500">Glazed Lens:</span>
                        <span className="font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                          {item.lensName || item.lensType || "Standard Demo Lenses"}
                        </span>
                        {item.lensPrice > 0 && (
                          <span className="text-[11px] text-gray-500">
                            (+{formatPrice(item.lensPrice)})
                          </span>
                        )}
                      </div>

                      {/* Prescription Card Box */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                            Prescription Information
                          </span>
                          <span className="text-[10px] font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                            Method: {item.prescriptionMethod || (hasSlip ? "UPLOAD" : hasNumbers ? "MANUAL" : isWhatsApp ? "WHATSAPP" : "STANDARD")}
                          </span>
                        </div>

                        {/* CASE 1: Uploaded Doctor Slip Image */}
                        {hasSlip && (
                          <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                                📸 Doctor Prescription Card Attached
                              </span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewRxImage(item.prescriptionImage)}
                                  className="text-xs font-bold text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200 transition-colors"
                                >
                                  Enlarge Slip
                                </button>
                                <a
                                  href={item.prescriptionImage}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg border border-gray-200 transition-colors flex items-center gap-1"
                                >
                                  <span>Open New Tab</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>

                            {/* Clickable Image Preview */}
                            <div
                              onClick={() => setPreviewRxImage(item.prescriptionImage)}
                              className="relative cursor-pointer group rounded-xl overflow-hidden border border-gray-200 max-h-48 flex items-center justify-center bg-gray-950"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.prescriptionImage}
                                alt="Customer Prescription Slip"
                                className="w-full max-h-48 object-contain group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>Click to Zoom Doctor Slip</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CASE 2: Clinical Manual Prescription Numbers Table */}
                        {hasNumbers && (
                          <div className="bg-white rounded-xl border border-blue-200 p-3 space-y-2">
                            <span className="text-xs font-bold text-blue-900 block">
                              ✍️ Ophthalmology Clinical Parameters
                            </span>
                            <div className="overflow-x-auto">
                              <table className="w-full text-center text-xs">
                                <thead className="bg-blue-50/60 text-blue-900 font-bold uppercase text-[10px] border-b">
                                  <tr>
                                    <th className="py-1 px-2 text-left">Eye</th>
                                    <th className="py-1 px-2">Sphere (SPH)</th>
                                    <th className="py-1 px-2">Cylinder (CYL)</th>
                                    <th className="py-1 px-2">Axis</th>
                                    <th className="py-1 px-2">Add (Bifocal)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-mono">
                                  <tr>
                                    <td className="py-1.5 px-2 font-bold text-left text-gray-700">Right (OD)</td>
                                    <td className="py-1.5 px-2 font-semibold text-gray-900">{item.prescriptionOD || rxJson?.sphereOD || "0.00"}</td>
                                    <td className="py-1.5 px-2 text-gray-600">{rxJson?.cylinderOD || "0.00"}</td>
                                    <td className="py-1.5 px-2 text-gray-600">{rxJson?.axisOD || "0"}°</td>
                                    <td className="py-1.5 px-2 text-gray-600">{item.additionOD || rxJson?.additionOD || "—"}</td>
                                  </tr>
                                  <tr>
                                    <td className="py-1.5 px-2 font-bold text-left text-gray-700">Left (OS)</td>
                                    <td className="py-1.5 px-2 font-semibold text-gray-900">{item.prescriptionOS || rxJson?.sphereOS || "0.00"}</td>
                                    <td className="py-1.5 px-2 text-gray-600">{rxJson?.cylinderOS || "0.00"}</td>
                                    <td className="py-1.5 px-2 text-gray-600">{rxJson?.axisOS || "0"}°</td>
                                    <td className="py-1.5 px-2 text-gray-600">{item.additionOS || rxJson?.additionOS || "—"}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="text-[11px] font-semibold text-gray-600 pt-1 border-t flex items-center justify-between">
                              <span>Pupillary Distance (PD):</span>
                              <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                                {item.prescriptionPD || rxJson?.pupillaryDistance || "62"} mm
                              </span>
                            </div>
                          </div>
                        )}

                        {/* CASE 3: WhatsApp Submission Request */}
                        {isWhatsApp && (
                          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3 text-xs text-emerald-900 flex items-center justify-between">
                            <div>
                              <p className="font-bold">📱 Customer Request: Send Slip via WhatsApp</p>
                              <p className="text-[11px] text-emerald-700 mt-0.5">
                                Please message customer at {selectedOrder.customerPhone} to obtain prescription before glazing.
                              </p>
                            </div>
                            <a
                              href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow shrink-0 ml-2"
                            >
                              Open WhatsApp Chat
                            </a>
                          </div>
                        )}

                        {/* CASE 4: Zero Power / Plano */}
                        {isPlano && (
                          <div className="bg-gray-100 rounded-xl p-2.5 text-xs text-gray-700 font-semibold">
                            👓 Zero Power / Plano (Cosmetic / Blue Light Cut Filter Only — No eyesight correction)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status & Courier Update Form */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900">
                Update Order Status & Dispatch
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Order Status
                  </label>
                  <select
                    value={newOrderStatus}
                    onChange={(e) => setNewOrderStatus(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs bg-white font-semibold"
                  >
                    <option value="PENDING">PENDING (Awaiting Review)</option>
                    <option value="CONFIRMED">CONFIRMED (Stock Reserved)</option>
                    <option value="PROCESSING">PROCESSING (Lens Glazing in Lab)</option>
                    <option value="SHIPPED">SHIPPED (Handed to Courier)</option>
                    <option value="DELIVERED">DELIVERED (Customer Received)</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs bg-white font-semibold"
                  >
                    <option value="PENDING">PENDING (COD / Unpaid)</option>
                    <option value="PAID">PAID (Settled)</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Courier Tracking Number (TCS / Leopards / Trax)
                </label>
                <input
                  type="text"
                  value={newTrackingNumber}
                  onChange={(e) => setNewTrackingNumber(e.target.value)}
                  placeholder="e.g. TCS-74892018 or LEOP-981240"
                  className="w-full p-2.5 border rounded-xl text-xs font-mono uppercase"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleUpdateOrderStatus}
                  disabled={isUpdatingOrder}
                  className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow"
                >
                  {isUpdatingOrder ? "Updating..." : "Save Order Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Slip Lightbox Modal */}
      {previewRxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="max-w-4xl w-full bg-gray-900 rounded-3xl p-4 overflow-hidden border border-white/10 shadow-2xl space-y-3">
            <div className="flex items-center justify-between text-white px-2">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-brand-400" />
                Customer Doctor Prescription Slip
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={previewRxImage}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold"
                >
                  Open Full File
                </a>
                <button
                  onClick={() => setPreviewRxImage(null)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center p-2 max-h-[80vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewRxImage}
                alt="Doctor Prescription Slip"
                className="max-w-full max-h-[75vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Lens Modal */}
      {isLensModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-sm text-gray-900">
                {editingLens ? `Edit ${editingLens.name}` : "Create New Optical Lens Option"}
              </h3>
              <button
                onClick={() => setIsLensModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLens} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Lens Name *
                </label>
                <input
                  type="text"
                  required
                  value={lensName}
                  onChange={(e) => setLensName(e.target.value)}
                  placeholder="e.g. Blue Cut / Computer Screen Lenses"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Optical Category Type *
                  </label>
                  <select
                    value={lensType}
                    onChange={(e) => setLensType(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-white font-semibold"
                  >
                    <option value="SINGLE_VISION">SINGLE_VISION</option>
                    <option value="BIFOCAL">BIFOCAL</option>
                    <option value="PROGRESSIVE">PROGRESSIVE</option>
                    <option value="FRAME_ONLY">FRAME_ONLY</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Glazing Surcharge (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={lensPrice}
                    onChange={(e) => setLensPrice(e.target.value)}
                    placeholder="1500"
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={lensDesc}
                  onChange={(e) => setLensDesc(e.target.value)}
                  placeholder="Description of the optical technology and whom it is recommended for..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Key Features (comma-separated tags)
                </label>
                <input
                  type="text"
                  value={lensFeatures}
                  onChange={(e) => setLensFeatures(e.target.value)}
                  placeholder="Blocks 99.8% Blue Light, UV400, Hydrophobic AR Coating, Scratch Resistant"
                  className="w-full p-2.5 border rounded-xl"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  These appear as benefit badges on the product purchase box and lens guide.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="lensActiveCheck"
                  checked={lensIsActive}
                  onChange={(e) => setLensIsActive(e.target.checked)}
                  className="w-4 h-4 text-brand-700 rounded"
                />
                <label htmlFor="lensActiveCheck" className="text-xs font-semibold text-gray-800">
                  Active (Display this lens option in customer purchase box)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsLensModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingLens}
                  className="px-6 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold shadow"
                >
                  {isSavingLens ? "Saving..." : "Save Lens"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-sm text-gray-900">
                Add New Eyewear Frame to Catalogue
              </h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Tom Ford Fausto Optical"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value.toUpperCase())}
                    placeholder="TF-FAUSTO-01"
                    className="w-full p-2.5 border rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Detailed specifications, frame shape, fit notes..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Brand *</label>
                  <select
                    value={newProdBrandId}
                    onChange={(e) => setNewProdBrandId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={newProdCategoryId}
                    onChange={(e) => setNewProdCategoryId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Base Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="12500"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    value={newProdSalePrice}
                    onChange={(e) => setNewProdSalePrice(e.target.value)}
                    placeholder="9999"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Frame Shape</label>
                  <select
                    value={newProdShape}
                    onChange={(e) => setNewProdShape(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    <option value="WAYFARER">WAYFARER</option>
                    <option value="AVIATOR">AVIATOR</option>
                    <option value="ROUND">ROUND</option>
                    <option value="SQUARE">SQUARE</option>
                    <option value="CAT_EYE">CAT_EYE</option>
                    <option value="CLUBMASTER">CLUBMASTER</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Virtual Try-On SVG Overlay</label>
                  <select
                    value={newProdOverlay}
                    onChange={(e) => setNewProdOverlay(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  >
                    <option value="/glasses/wayfarer-black.svg">/glasses/wayfarer-black.svg</option>
                    <option value="/glasses/aviator-gold.svg">/glasses/aviator-gold.svg</option>
                    <option value="/glasses/round-metal.svg">/glasses/round-metal.svg</option>
                    <option value="/glasses/cat-eye.svg">/glasses/cat-eye.svg</option>
                    <option value="/glasses/transparent-crystal.svg">/glasses/transparent-crystal.svg</option>
                    <option value="/glasses/clubmaster.svg">/glasses/clubmaster.svg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Photo URL (Unsplash / Cloudinary)</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProd}
                  className="px-6 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold shadow"
                >
                  {isSavingProd ? "Creating..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
