
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Package, 
  Settings, 
  CreditCard, 
  Megaphone,
  LogOut,
  Search,
  Check,
  X,
  Plus,
  Edit2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

import { User, RechargeRequest, WithdrawRequest, Product, AppSettings, Notice, UserStatus, ApprovalStatus } from './types';
import { generateNoticeContent } from './services/geminiService';

// --- Components ---

const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      onLogin();
    } else {
      alert('Invalid Credentials. Hint: admin / password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-900 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Settings className="w-10 h-10 text-indigo-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Titan Admin</h2>
        <p className="text-center text-gray-500 mb-8">Secure Access Portal</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter username (admin)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="•••••••• (password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-400">
          Demo Access: <span className="font-mono">admin / password</span>
        </p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '1,284', icon: Users, color: 'bg-blue-500' },
    { label: 'Total Recharge', value: '$45,200', icon: ArrowUpCircle, color: 'bg-green-500' },
    { label: 'Total Withdraw', value: '$22,150', icon: ArrowDownCircle, color: 'bg-red-500' },
    { label: 'Active VIPs', value: '412', icon: Package, color: 'bg-indigo-500' },
  ];

  const data = [
    { name: 'Mon', recharge: 4000, withdraw: 2400 },
    { name: 'Tue', recharge: 3000, withdraw: 1398 },
    { name: 'Wed', recharge: 2000, withdraw: 9800 },
    { name: 'Thu', recharge: 2780, withdraw: 3908 },
    { name: 'Fri', recharge: 1890, withdraw: 4800 },
    { name: 'Sat', recharge: 2390, withdraw: 3800 },
    { name: 'Sun', recharge: 3490, withdraw: 4300 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Financial Overview (Weekly)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRecharge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="recharge" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRecharge)" />
              <Area type="monotone" dataKey="withdraw" stroke="#ef4444" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1001', name: 'John Doe', mobile: '+1234567890', status: UserStatus.ACTIVE, vipLevel: 2, walletBalance: 500 },
    { id: '1002', name: 'Jane Smith', mobile: '+0987654321', status: UserStatus.BLOCKED, vipLevel: 1, walletBalance: 120 },
  ]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleUpdate = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search Users..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">User ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Mobile</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">VIP</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{user.id}</td>
                <td className="px-6 py-4 text-sm">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.mobile}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.status === UserStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">Lvl {user.vipLevel}</td>
                <td className="px-6 py-4 text-sm font-semibold">${user.walletBalance}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setEditingUser(user)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-6">Update User {editingUser.id}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  value={editingUser.name} 
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">VIP Level</label>
                  <input 
                    type="number" 
                    value={editingUser.vipLevel} 
                    onChange={(e) => setEditingUser({...editingUser, vipLevel: parseInt(e.target.value)})}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select 
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value as UserStatus})}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={UserStatus.ACTIVE}>Active</option>
                    <option value={UserStatus.BLOCKED}>Block</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Wallet Balance</label>
                <input 
                  type="number" 
                  value={editingUser.walletBalance} 
                  onChange={(e) => setEditingUser({...editingUser, walletBalance: parseFloat(e.target.value)})}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-8 flex space-x-4">
              <button onClick={() => setEditingUser(null)} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleUpdate(editingUser)} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ApprovalForms: React.FC<{ type: 'recharge' | 'withdraw' }> = ({ type }) => {
  const isRecharge = type === 'recharge';
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold">{isRecharge ? 'Recharge Approvals' : 'Withdrawal Approvals'}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">User ID</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">{isRecharge ? 'UTR / Channel' : 'Bank Details'}</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium">1022</td>
              <td className="px-6 py-4 text-sm font-bold text-indigo-600">$500.00</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {isRecharge ? 'UTR: 92837482 | USDT' : 'Chase Bank | ...1234'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">2023-10-25 14:20</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold">PENDING</span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  <Check className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 'p1', name: 'Starter Plan', price: 100, dailyIncome: 5, totalIncome: 150, duration: 30, userLimit: 1000, status: 'Active' },
    { id: 'p2', name: 'Pro Plan', price: 500, dailyIncome: 30, totalIncome: 900, duration: 30, userLimit: 200, status: 'Active' },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">VIP / Product Catalog</h3>
        <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group overflow-hidden hover:border-indigo-200 transition-all">
            <div className={`absolute top-0 right-0 p-2 text-[10px] font-bold uppercase rounded-bl-lg ${p.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
              {p.status}
            </div>
            <h4 className="text-lg font-bold mb-4">{p.name}</h4>
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-gray-500"><span>Price</span> <span className="font-bold text-gray-800">${p.price}</span></div>
              <div className="flex justify-between text-gray-500"><span>Daily ROI</span> <span className="font-bold text-green-600">${p.dailyIncome}</span></div>
              <div className="flex justify-between text-gray-500"><span>Total Return</span> <span className="font-bold text-indigo-600">${p.totalIncome}</span></div>
              <div className="flex justify-between text-gray-500"><span>Duration</span> <span className="font-bold text-gray-800">{p.duration} Days</span></div>
              <div className="flex justify-between text-gray-500"><span>Limit</span> <span className="font-bold text-gray-800">{p.userLimit} Users</span></div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">Edit</button>
              <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">Disable</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SystemSettings: React.FC = () => {
  const [commissions, setCommissions] = useState({ l1: 10, l2: 5, l3: 2 });
  const [bank, setBank] = useState({ name: 'Titan Global Bank', ac: '998877665544', ifsc: 'TITAN001', upi: 'titan@upi' });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      {/* Commission Control */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>Income Control Settings</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Level 1 Commission (%)</label>
            <input type="number" value={commissions.l1} onChange={(e) => setCommissions({...commissions, l1: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Level 2 Commission (%)</label>
            <input type="number" value={commissions.l2} onChange={(e) => setCommissions({...commissions, l2: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Level 3 Commission (%)</label>
            <input type="number" value={commissions.l3} onChange={(e) => setCommissions({...commissions, l3: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-indigo-100 mt-4 hover:bg-indigo-700 transition-colors">Save Commission Logic</button>
        </div>
      </div>

      {/* Bank Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-green-600" />
          <span>Bank & Payment Gateway</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Company Bank Name</label>
            <input type="text" value={bank.name} onChange={(e) => setBank({...bank, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Account Number</label>
              <input type="text" value={bank.ac} onChange={(e) => setBank({...bank, ac: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">IFSC Code</label>
              <input type="text" value={bank.ifsc} onChange={(e) => setBank({...bank, ifsc: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">UPI ID</label>
            <input type="text" value={bank.upi} onChange={(e) => setBank({...bank, upi: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
             <div className="text-center">
                <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2 group-hover:text-indigo-400 transition-colors" />
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">QR Code Upload</p>
                <input type="file" className="text-xs text-gray-500 block w-full opacity-0 absolute" />
             </div>
          </div>
          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-green-100 mt-2 hover:bg-green-700 transition-colors">Update Banking Details</button>
        </div>
      </div>
    </div>
  );
};

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([
    { id: '1', title: 'System Maintenance', description: 'Upgrading servers on Oct 30th.', published: true },
    { id: '2', title: 'New VIP Rewards', description: 'Higher commissions for VIP 3+ users.', published: false },
  ]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const result = await generateNoticeContent(prompt);
    setNotices([{ id: Date.now().toString(), title: result.title, description: result.description, published: false }, ...notices]);
    setPrompt('');
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-xl text-white">
        <h3 className="text-2xl font-bold mb-2 flex items-center space-x-2">
          <Megaphone className="w-6 h-6" />
          <span>AI Notice Assistant</span>
        </h3>
        <p className="text-indigo-100 mb-6 text-sm">Let Gemini draft your professional announcements in seconds.</p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <input 
            type="text" 
            placeholder="E.g., Diwali Bonus Offer or Maintenance Update" 
            className="flex-1 px-6 py-3 rounded-xl text-gray-800 font-medium focus:ring-4 focus:ring-white/20 outline-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={handleAiGenerate}
            disabled={isGenerating}
            className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 min-w-[160px]"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Drafting...</span>
              </>
            ) : 'Generate with AI'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notices.map((n) => (
          <div key={n.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group hover:border-indigo-100 transition-all">
            <h4 className="text-lg font-bold text-gray-800 mb-2">{n.title}</h4>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{n.description}</p>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${n.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {n.published ? 'Published' : 'Hidden'}
              </span>
              <div className="flex space-x-2">
                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button className={`p-2 rounded-lg transition-colors ${n.published ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                  {n.published ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Layout & Main App ---

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex bg-gray-50 overflow-x-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-0 h-screen z-20">
          <div className="p-6 flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Titan Admin
            </h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/users" icon={Users} label="Users" />
            <NavItem to="/recharges" icon={ArrowUpCircle} label="Recharges" />
            <NavItem to="/withdrawals" icon={ArrowDownCircle} label="Withdrawals" />
            <NavItem to="/products" icon={Package} label="VIP / Products" />
            <NavItem to="/settings" icon={Settings} label="System Settings" />
            <NavItem to="/notices" icon={Megaphone} label="Notice Board" />
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
            <div className="flex items-center lg:hidden">
              <Settings className="w-6 h-6 text-indigo-600 mr-4" />
              <h1 className="font-bold text-lg">Titan</h1>
            </div>
            <div className="flex-1 max-w-xl mx-auto hidden md:block">
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">Super Admin</p>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Security Level: High</p>
              </div>
              <img src="https://picsum.photos/40/40" className="w-10 h-10 rounded-full ring-2 ring-indigo-100" alt="Avatar" />
            </div>
          </header>

          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/recharges" element={<ApprovalForms type="recharge" />} />
              <Route path="/withdrawals" element={<ApprovalForms type="withdraw" />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/settings" element={<SystemSettings />} />
              <Route path="/notices" element={<NoticeBoard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

const NavItem: React.FC<{ to: string, icon: any, label: string }> = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (location.pathname === '/' && to === '/dashboard');
  
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
        isActive 
          ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
      <span>{label}</span>
    </Link>
  );
};

export default App;
