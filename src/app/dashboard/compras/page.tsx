'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, Plus, Package, CreditCard, 
  QrCode, Eye, Edit3, Trash2, Filter,
  TrendingUp, DollarSign, Users, BarChart3,
  Plane, Home, Droplets, Utensils, MapPin, Monitor
} from 'lucide-react'

export default function ComprasClientePage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products')
  const [showAddProduct, setShowAddProduct] = useState(false)

  const products = [
    {
      id: 1,
      name: 'Cota de Lua de Mel - Maldivas',
      price: 500,
      icon: 'Plane',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      category: 'Lua de Mel',
      sold: 12,
      available: 8
    },
    {
      id: 2,
      name: 'Kit Chá de Cozinha Premium',
      price: 250,
      icon: 'Home',
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      category: 'Casa',
      sold: 8,
      available: 12
    },
    {
      id: 3,
      name: 'Jogo de Toalhas Bordadas',
      price: 180,
      icon: 'Droplets',
      iconColor: 'text-cyan-500',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
      category: 'Casa',
      sold: 15,
      available: 5
    },
    {
      id: 4,
      name: 'Aparelho de Jantar Completo',
      price: 450,
      icon: 'Utensils',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      category: 'Casa',
      sold: 5,
      available: 10
    },
    {
      id: 5,
      name: 'Cota Viagem Nacional',
      price: 300,
      icon: 'MapPin',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      category: 'Lua de Mel',
      sold: 10,
      available: 10
    },
    {
      id: 6,
      name: 'Smart TV 55"',
      price: 2500,
      icon: 'Monitor',
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      category: 'Eletrônicos',
      sold: 2,
      available: 3
    }
  ]

  const orders = [
    {
      id: 1,
      buyer: 'Maria Silva',
      product: 'Cota de Lua de Mel - Maldivas',
      value: 500,
      date: '2024-01-20',
      status: 'paid',
      payment: 'PIX'
    },
    {
      id: 2,
      buyer: 'João Santos',
      product: 'Kit Chá de Cozinha Premium',
      value: 250,
      date: '2024-01-22',
      status: 'paid',
      payment: 'Cartão'
    },
    {
      id: 3,
      buyer: 'Ana Costa',
      product: 'Jogo de Toalhas Bordadas',
      value: 180,
      date: '2024-01-25',
      status: 'pending',
      payment: 'PIX'
    }
  ]

  const stats = {
    totalRevenue: 8450,
    totalOrders: 52,
    totalProducts: 12,
    conversionRate: 34.6
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lista de Presentes</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie os produtos do seu site</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowAddProduct(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Produto
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-500" />
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {stats.totalRevenue.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-blue-600 font-medium">+12%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Vendas Realizadas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-purple-600 font-medium">{stats.totalProducts}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Produtos Ativos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-orange-500" />
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.conversionRate}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conversão</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'products'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Análises
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className={`h-32 ${product.bgColor} flex items-center justify-center`}>
                {product.icon === 'Plane' && <Plane className={`w-12 h-12 ${product.iconColor}`} />}
                {product.icon === 'Home' && <Home className={`w-12 h-12 ${product.iconColor}`} />}
                {product.icon === 'Droplets' && <Droplets className={`w-12 h-12 ${product.iconColor}`} />}
                {product.icon === 'Utensils' && <Utensils className={`w-12 h-12 ${product.iconColor}`} />}
                {product.icon === 'MapPin' && <MapPin className={`w-12 h-12 ${product.iconColor}`} />}
                {product.icon === 'Monitor' && <Monitor className={`w-12 h-12 ${product.iconColor}`} />}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    R$ {product.price.toLocaleString('pt-BR')}
                  </p>
                  <div className="text-right">
                    <p className="text-sm text-green-600">{product.sold} vendidos</p>
                    <p className="text-xs text-gray-500">{product.available} disponíveis</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium">
                    <Eye className="w-4 h-4 inline mr-1" />
                    Ver
                  </button>
                  <button className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium">
                    <QrCode className="w-4 h-4 inline mr-1" />
                    QR Code
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pedidos Recentes</h3>
              <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtrar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Comprador</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Produto</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Valor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Pagamento</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900 dark:text-white">{order.buyer}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600 dark:text-gray-400">{order.product}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          R$ {order.value.toLocaleString('pt-BR')}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600 dark:text-gray-400">
                          {new Date(order.date).toLocaleDateString('pt-BR')}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {order.payment}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'paid'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {order.status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Produtos Mais Vendidos</h3>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${product.bgColor} rounded-lg flex items-center justify-center`}>
                      {product.icon === 'Plane' && <Plane className={`w-5 h-5 ${product.iconColor}`} />}
                      {product.icon === 'Home' && <Home className={`w-5 h-5 ${product.iconColor}`} />}
                      {product.icon === 'Droplets' && <Droplets className={`w-5 h-5 ${product.iconColor}`} />}
                      {product.icon === 'Utensils' && <Utensils className={`w-5 h-5 ${product.iconColor}`} />}
                      {product.icon === 'MapPin' && <MapPin className={`w-5 h-5 ${product.iconColor}`} />}
                      {product.icon === 'Monitor' && <Monitor className={`w-5 h-5 ${product.iconColor}`} />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product.sold} vendas</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    R$ {(product.price * product.sold).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Métodos de Pagamento</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <QrCode className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">PIX</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">32 transações</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">65%</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Cartão</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">20 transações</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">35%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Product */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Adicionar Produto</h3>
            {/* Form aqui */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddProduct(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                Adicionar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
