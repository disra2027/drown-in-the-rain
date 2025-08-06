"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import BottomNavigation from "@/components/BottomNavigation";
import WishlistModal from "@/components/WishlistModal";

// Type definitions
type Priority = 'low' | 'medium' | 'high' | 'urgent';
type Category = 'electronics' | 'clothing' | 'books' | 'home' | 'travel' | 'health' | 'other';
type FilterStatus = 'all' | 'purchased' | 'unpurchased';
type SortBy = 'name' | 'price' | 'priority' | 'dateAdded' | 'category';

interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category: Category;
  priority: Priority;
  purchased: boolean;
  dateAdded: Date;
  url?: string;
  notes?: string;
  imageUrl?: string;
}

const mockWishlistItems: WishlistItem[] = [
  {
    id: '1',
    name: 'MacBook Pro M3',
    description: '16-inch laptop for development work',
    price: 2499,
    category: 'electronics',
    priority: 'high',
    purchased: false,
    dateAdded: new Date('2024-01-15'),
    url: 'https://apple.com',
    notes: 'Need for better performance on large projects'
  },
  {
    id: '2',
    name: 'Ergonomic Office Chair',
    description: 'Herman Miller Aeron size B',
    price: 1395,
    category: 'home',
    priority: 'medium',
    purchased: false,
    dateAdded: new Date('2024-01-20'),
    notes: 'Back support for long coding sessions'
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    description: 'Cherry MX Blue switches',
    price: 150,
    category: 'electronics',
    priority: 'medium',
    purchased: true,
    dateAdded: new Date('2024-01-10'),
    notes: 'Purchased last week - loving the tactile feedback!'
  },
  {
    id: '4',
    name: 'Programming Books Set',
    description: 'Clean Code, Design Patterns, System Design',
    price: 120,
    category: 'books',
    priority: 'low',
    purchased: false,
    dateAdded: new Date('2024-01-25'),
  },
  {
    id: '5',
    name: 'Wireless Earbuds',
    description: 'Sony WF-1000XM4 with noise cancellation',
    price: 280,
    category: 'electronics',
    priority: 'medium',
    purchased: false,
    dateAdded: new Date('2024-01-18'),
    url: 'https://sony.com'
  },
  {
    id: '6',
    name: 'Standing Desk Converter',
    description: 'Height adjustable desk riser',
    price: 299,
    category: 'home',
    priority: 'high',
    purchased: false,
    dateAdded: new Date('2024-01-22'),
    notes: 'Need to alternate between sitting and standing'
  }
];

const categoryEmojis: Record<Category, string> = {
  electronics: '💻',
  clothing: '👔',
  books: '📚',
  home: '🏠',
  travel: '✈️',
  health: '💊',
  other: '📦'
};

const categoryGradients: Record<Category, string> = {
  electronics: 'from-chart-1/20 to-chart-5/20',
  clothing: 'from-chart-4/20 to-chart-2/20',
  books: 'from-chart-3/20 to-chart-1/20',
  home: 'from-chart-2/20 to-chart-5/20',
  travel: 'from-chart-5/20 to-chart-3/20',
  health: 'from-chart-2/20 to-chart-4/20',
  other: 'from-muted/30 to-muted/10'
};

const funMessages = [
  "Time to treat yourself! 🎉",
  "Your future self will thank you! ⭐",
  "Dreams are just wishes with deadlines! 💫",
  "Life's too short for boring stuff! 🌈",
  "Every purchase tells a story! 📖",
  "Investing in your happiness! 💝"
];

const purchaseMessages = [
  "Woohoo! Dreams do come true! 🎊",
  "Another one bites the dust! ✨",
  "Level up complete! 🚀",
  "You're on fire! 🔥",
  "Victory dance time! 💃",
  "Treating yourself like royalty! 👑"
];

const priorityColors: Record<Priority, string> = {
  low: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
  medium: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  high: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  urgent: 'bg-red-100 text-red-800 border-red-200'
};

// Number formatting utility
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(mockWishlistItems);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('dateAdded');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [celebratingItem, setCelebratingItem] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [funMessage, setFunMessage] = useState(funMessages[0]);
  const [shakeItem, setShakeItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [editingInModal, setEditingInModal] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState<Partial<WishlistItem>>({
    name: '',
    description: '',
    price: undefined,
    category: 'other',
    priority: 'medium',
    url: '',
    notes: ''
  });

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // Filter and sort items
  const filteredAndSortedItems = wishlistItems
    .filter(item => {
      // Filter by purchase status
      if (filterStatus === 'purchased' && !item.purchased) return false;
      if (filterStatus === 'unpurchased' && item.purchased) return false;
      
      // Filter by search term
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !item.description?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      // Filter by category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      
      // Filter by priority
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
      
      return true;
    })
    .sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'priority':
          const priorityOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dateAdded':
          aValue = a.dateAdded.getTime();
          bValue = b.dateAdded.getTime();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleAddItem = () => {
    if (!newItem.name?.trim()) return;
    
    const item: WishlistItem = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      description: newItem.description?.trim() || undefined,
      price: newItem.price || undefined,
      category: newItem.category || 'other',
      priority: newItem.priority || 'medium',
      purchased: false,
      dateAdded: new Date(),
      url: newItem.url?.trim() || undefined,
      notes: newItem.notes?.trim() || undefined
    };
    
    setWishlistItems([item, ...wishlistItems]);
    setNewItem({
      name: '',
      description: '',
      price: undefined,
      category: 'other',
      priority: 'medium',
      url: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleTogglePurchased = (id: string) => {
    const item = wishlistItems.find(item => item.id === id);
    
    setWishlistItems(items => 
      items.map(item => 
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );

    // Celebration animation for purchasing items
    if (item && !item.purchased) {
      setCelebratingItem(id);
      setShowConfetti(true);
      setFunMessage(purchaseMessages[Math.floor(Math.random() * purchaseMessages.length)]);
      
      // Reset celebration after animation
      setTimeout(() => {
        setCelebratingItem(null);
        setShowConfetti(false);
      }, 2000);
    }
  };

  const handleDeleteItem = (id: string) => {
    // Shake animation before delete
    setShakeItem(id);
    
    setTimeout(() => {
      setWishlistItems(items => items.filter(item => item.id !== id));
      setShakeItem(null);
      // Close modal if deleting the currently viewed item
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }, 500);
  };

  const handleItemClick = (item: WishlistItem) => {
    setSelectedItem(item);
    setEditingInModal(false);
  };

  const handleModalEdit = (updates: Partial<WishlistItem>) => {
    if (!selectedItem) return;
    
    setWishlistItems(items =>
      items.map(item =>
        item.id === selectedItem.id ? { ...item, ...updates } : item
      )
    );
    
    // Update the selected item with changes
    setSelectedItem({ ...selectedItem, ...updates });
  };

  const closeModal = () => {
    setSelectedItem(null);
    setEditingInModal(false);
  };


  // Calculate statistics
  const totalItems = wishlistItems.length;
  const purchasedItems = wishlistItems.filter(item => item.purchased).length;
  const totalValue = wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const unpurchasedValue = wishlistItems
    .filter(item => !item.purchased)
    .reduce((sum, item) => sum + (item.price || 0), 0);
  
  // Gamification stats
  const completionRate = totalItems > 0 ? (purchasedItems / totalItems * 100) : 0;
  const currentStreak = wishlistItems.filter(item => item.purchased).length;
  const highPriorityItems = wishlistItems.filter(item => item.priority === 'high' || item.priority === 'urgent').length;
  
  // Achievement badges
  const achievements = [
    { name: "First Purchase!", emoji: "🎯", unlocked: purchasedItems >= 1 },
    { name: "Shopaholic", emoji: "🛍️", unlocked: purchasedItems >= 3 },
    { name: "Big Spender", emoji: "💰", unlocked: totalValue >= 1000 },
    { name: "Goal Getter", emoji: "🏆", unlocked: completionRate >= 50 },
    { name: "Wishlist Master", emoji: "👑", unlocked: totalItems >= 10 }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 slide-in-from-top-1">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between gap-2">
              {/* Left side - Title and info */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl animate-bounce">💝</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-base sm:text-lg font-bold text-foreground">Dream Wishlist</h1>
                    {filteredAndSortedItems.length !== totalItems && (
                      <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                        {filteredAndSortedItems.length}/{totalItems}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground hidden sm:block truncate">{funMessage}</p>
                </div>
              </div>
              
              {/* Right side - Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Achievement badges */}
                <div className="hidden sm:flex items-center gap-1">
                  {achievements.filter(a => a.unlocked).slice(0, 2).map(achievement => (
                    <span 
                      key={achievement.name}
                      className="text-sm animate-bounce" 
                      style={{ animationDelay: `${Math.random() * 1000}ms` }}
                      title={achievement.name}
                    >
                      {achievement.emoji}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all duration-200 active:scale-95 text-sm font-medium"
                >
                  <span className="sm:hidden">+ Add</span>
                  <span className="hidden sm:inline">+ Add Item</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4">
          {/* Fun Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-chart-1/10 border border-chart-1/20 rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group hover:bg-chart-1/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-chart-1 text-xs font-medium">Dream Collection</div>
                  <div className="font-bold text-xl text-chart-1 transition-all duration-500 group-hover:scale-110">{formatNumber(totalItems)}</div>
                </div>
                <div className="text-2xl group-hover:animate-spin">📦</div>
              </div>
            </div>
            
            <div className="bg-chart-2/10 border border-chart-2/20 rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group hover:bg-chart-2/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-chart-2 text-xs font-medium">Victory Count</div>
                  <div className="font-bold text-xl text-chart-2 transition-all duration-500 group-hover:scale-110">{formatNumber(purchasedItems)}</div>
                </div>
                <div className="text-2xl group-hover:animate-bounce">🎯</div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-chart-2/80 font-medium">
                  {completionRate.toFixed(0)}% complete
                </span>
                <div className="w-20 bg-chart-2/20 rounded-full h-1.5">
                  <div 
                    className="bg-chart-2 h-1.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-chart-5/10 border border-chart-5/20 rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group hover:bg-chart-5/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-chart-5 text-xs font-medium">Dream Value</div>
                  <div className="font-bold text-xl text-chart-5 transition-all duration-500 group-hover:scale-110">{formatPrice(totalValue)}</div>
                </div>
                <div className="text-2xl group-hover:animate-pulse">💎</div>
              </div>
            </div>
            
            <div className="bg-chart-3/10 border border-chart-3/20 rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group hover:bg-chart-3/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-chart-3 text-xs font-medium">Adventure Fund</div>
                  <div className="font-bold text-xl text-chart-3 transition-all duration-500 group-hover:scale-110">{formatPrice(unpurchasedValue)}</div>
                </div>
                <div className="text-2xl group-hover:animate-wiggle">🚀</div>
              </div>
            </div>
          </div>
          
          {/* Achievement Section */}
          {achievements.filter(a => a.unlocked).length > 0 && (
            <div className="bg-chart-3/10 border border-chart-3/20 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏆</span>
                <h3 className="font-semibold text-chart-3">Your Achievements</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.name}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'bg-chart-3/20 text-chart-3 border border-chart-3/30 animate-pulse' 
                        : 'bg-muted/50 text-muted-foreground opacity-50'
                    }`}
                  >
                    <span className="mr-1">{achievement.emoji}</span>
                    {achievement.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="bg-card rounded-lg p-4 border border-border mb-4">
            <div className="flex flex-col gap-3">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 focus:shadow-lg focus:shadow-primary/10"
              />
              
              {/* Filter Controls */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="bg-background border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/50"
                >
                  <option value="all">All Items</option>
                  <option value="purchased">Purchased</option>
                  <option value="unpurchased">Wishlist</option>
                </select>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
                  className="bg-background border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/50"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(categoryEmojis).map(([category, emoji]) => (
                    <option key={category} value={category}>{emoji} {category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Priority | 'all')}
                  className="bg-background border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/50"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🔵 Low</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="bg-background border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/50"
                >
                  <option value="dateAdded">Date Added</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="priority">Priority</option>
                  <option value="category">Category</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 bg-background border border-border rounded-lg hover:bg-muted/20 transition-all duration-200 hover:border-primary/50 active:scale-95"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className={`transition-transform duration-300 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}>
                    <path d="M6 0L10 4H8V8H4V4H2L6 0Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Wishlist Items - 2 Column Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredAndSortedItems.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground animate-in fade-in-50 duration-300">
                <div className="text-4xl mb-3 animate-in zoom-in-95 duration-500 delay-100">
                  {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || filterStatus !== 'all' ? '🔍' : '💝'}
                </div>
                <p className="animate-in slide-in-from-bottom-2 duration-300 delay-200">
                  {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || filterStatus !== 'all' 
                    ? 'No items match your filters' 
                    : 'Your wishlist is empty'}
                </p>
                <p className="text-xs mt-1 animate-in slide-in-from-bottom-2 duration-300 delay-300">
                  {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Add your first item to get started'}
                </p>
              </div>
            ) : (
              filteredAndSortedItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    // Don't open modal if clicking on interactive elements
                    const target = e.target as HTMLElement;
                    if (!target.closest('button') && !target.closest('a')) {
                      handleItemClick(item);
                    }
                  }}
                  className={`group relative bg-gradient-to-br ${categoryGradients[item.category]} rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4 cursor-pointer ${
                    item.purchased 
                      ? 'border-chart-2/30 bg-chart-2/10 opacity-80 scale-95' 
                      : 'border-border/50 hover:border-primary/30 bg-card/50'
                  } ${celebratingItem === item.id ? 'animate-pulse scale-110' : ''} ${
                    shakeItem === item.id ? 'animate-shake' : ''
                  }`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationDuration: '400ms'
                  }}
                >
                  {/* Priority Badge */}
                  <div className={`absolute top-1 right-1 z-10 px-1 py-0.5 rounded-full text-xs font-medium border ${priorityColors[item.priority]} sm:top-2 sm:right-2 sm:px-1.5`}>
                    <span className="hidden sm:inline">{item.priority}</span>
                    <span className="sm:hidden text-xs">
                      {item.priority === 'urgent' ? '🔴' : item.priority === 'high' ? '🟠' : item.priority === 'medium' ? '🟡' : '🔵'}
                    </span>
                  </div>

                  {/* Purchase Status Checkbox */}
                  <button
                    onClick={() => handleTogglePurchased(item.id)}
                    className={`absolute top-1 left-1 z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 sm:top-2 sm:left-2 sm:w-6 sm:h-6 ${
                      item.purchased 
                        ? 'bg-chart-2 border-chart-2 text-white shadow-lg' 
                        : 'border-white/60 bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {item.purchased ? (
                      <span className="text-xs sm:text-sm">✓</span>
                    ) : (
                      <div className="w-2 h-2 rounded-full border border-current opacity-60 sm:w-3 sm:h-3" />
                    )}
                  </button>

                  {/* Image placeholder with category emoji */}
                  <div className="h-24 bg-gradient-to-b from-transparent to-black/20 flex items-center justify-center relative sm:h-32">
                    <span className={`text-2xl transition-transform duration-300 sm:text-4xl ${item.purchased ? 'grayscale' : 'group-hover:scale-110'}`}>
                      {categoryEmojis[item.category]}
                    </span>
                    {/* Overlay for purchased items */}
                    {item.purchased && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="text-lg sm:text-2xl">✨</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2 sm:p-3">
                    {/* Item Name */}
                    <h3 className={`font-bold text-xs leading-tight mb-2 line-clamp-2 sm:text-sm sm:mb-2 ${
                      item.purchased 
                        ? 'line-through text-muted-foreground' 
                        : 'text-foreground'
                    }`}>
                      {item.name}
                    </h3>

                    {/* Price and Link Row */}
                    <div className="flex items-center justify-between mb-1">
                      {/* Price */}
                      {item.price && (
                        <span className={`font-bold text-xs sm:text-sm ${
                          item.purchased 
                            ? 'line-through text-muted-foreground' 
                            : 'text-chart-3'
                        }`}>
                          {formatPrice(item.price)}
                        </span>
                      )}
                      
                      <div className="flex items-center gap-1">
                        {/* Hot Link */}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1 sm:px-2 sm:py-1"
                            title="Visit link"
                          >
                            <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" className="sm:w-3 sm:h-3">
                              <path d="M9 3L3 9M9 3H5M9 3V7"/>
                            </svg>
                            <span className="hidden sm:inline">Buy</span>
                          </a>
                        )}
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 hover:bg-red-100 rounded-full text-muted-foreground hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 sm:p-1.5"
                          title="Delete item"
                        >
                          <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" className="sm:w-3 sm:h-3">
                            <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Description - Only show on larger screens or when no notes */}
                    {item.description && !item.notes && (
                      <p className={`text-xs line-clamp-2 sm:line-clamp-3 ${
                        item.purchased 
                          ? 'text-muted-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {item.description}
                      </p>
                    )}

                    {/* Notes - Prioritize over description on mobile */}
                    {item.notes && (
                      <div className="p-1.5 bg-muted/20 rounded text-xs text-muted-foreground line-clamp-2 sm:p-2">
                        <span className="hidden sm:inline">💭 </span>{item.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={closeModal}>
            <div 
              className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] shadow-2xl border border-gold bounce-in my-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header */}
              <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0 rounded-t-2xl">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-3">
                  <span className="text-2xl">{categoryEmojis[selectedItem.category]}</span>
                  <div className="min-w-0">
                    {editingInModal ? (
                      <input
                        type="text"
                        value={selectedItem.name}
                        onChange={(e) => handleModalEdit({ name: e.target.value })}
                        className="w-full bg-background text-base font-semibold text-foreground border border-gold rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold/20 focus-ring-luxury"
                        autoFocus
                      />
                    ) : (
                      <span className={`${selectedItem.purchased ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {selectedItem.name}
                      </span>
                    )}
                  </div>
                </h3>
                <div className="flex items-center gap-2">
                  {/* Purchase Status */}
                  <button
                    onClick={() => handleTogglePurchased(selectedItem.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 focus-ring-luxury ${
                      selectedItem.purchased 
                        ? 'bg-chart-2 border-chart-2 text-white shadow-lg' 
                        : 'border-gold/40 bg-gold/10 hover:bg-gold/20'
                    }`}
                  >
                    {selectedItem.purchased ? (
                      <span className="text-sm">✓</span>
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                  </button>
                  
                  <button
                    onClick={closeModal}
                    className="p-2 text-muted-foreground hover:text-gold transition-colors hover:scale-110 focus-ring-luxury"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                {/* Description */}
                {(selectedItem.description || editingInModal) && (
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                    {editingInModal ? (
                      <textarea
                        value={selectedItem.description || ''}
                        onChange={(e) => handleModalEdit({ description: e.target.value })}
                        className="w-full bg-background border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-300 focus-ring-luxury"
                        rows={3}
                        placeholder="Add a description..."
                      />
                    ) : (
                      <p className="text-sm text-foreground">{selectedItem.description}</p>
                    )}
                  </div>
                )}

                {/* Price and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Price</label>
                    {editingInModal ? (
                      <input
                        type="number"
                        value={selectedItem.price || ''}
                        onChange={(e) => handleModalEdit({ price: parseFloat(e.target.value) || undefined })}
                        className="w-full bg-background border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-300 focus-ring-luxury"
                        placeholder="0"
                      />
                    ) : (
                      <p className="text-sm font-bold text-gold">
                        {selectedItem.price ? formatPrice(selectedItem.price) : 'No price set'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                    {editingInModal ? (
                      <select
                        value={selectedItem.category}
                        onChange={(e) => handleModalEdit({ category: e.target.value as Category })}
                        className="w-full bg-background border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-300 focus-ring-luxury"
                      >
                        {Object.entries(categoryEmojis).map(([category, emoji]) => (
                          <option key={category} value={category}>{emoji} {category}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm">
                        {categoryEmojis[selectedItem.category]} {selectedItem.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Priority</label>
                  {editingInModal ? (
                    <select
                      value={selectedItem.priority}
                      onChange={(e) => handleModalEdit({ priority: e.target.value as Priority })}
                      className="w-full bg-background border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-300 focus-ring-luxury"
                    >
                      <option value="low">🔵 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🟠 High Priority</option>
                      <option value="urgent">🔴 Urgent</option>
                    </select>
                  ) : (
                    <p className="text-sm">
                      {selectedItem.priority === 'urgent' ? '🔴' : selectedItem.priority === 'high' ? '🟠' : selectedItem.priority === 'medium' ? '🟡' : '🔵'} {selectedItem.priority}
                    </p>
                  )}
                </div>

                {/* URL */}
                {(selectedItem.url || editingInModal) && (
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Link</label>
                    {editingInModal ? (
                      <input
                        type="url"
                        value={selectedItem.url || ''}
                        onChange={(e) => handleModalEdit({ url: e.target.value })}
                        className="w-full bg-background border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-300 focus-ring-luxury"
                        placeholder="https://..."
                      />
                    ) : selectedItem.url ? (
                      <a
                        href={selectedItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors hover:scale-105"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        Visit Link
                      </a>
                    ) : null}
                  </div>
                )}

                {/* Notes */}
                {(selectedItem.notes || editingInModal) && (
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                    {editingInModal ? (
                      <textarea
                        value={selectedItem.notes || ''}
                        onChange={(e) => handleModalEdit({ notes: e.target.value })}
                        className="w-full bg-background border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-300 focus-ring-luxury"
                        rows={3}
                        placeholder="Add your notes..."
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground bg-gold/10 border border-gold/20 p-3 rounded-lg">
                        💭 {selectedItem.notes}
                      </p>
                    )}
                  </div>
                )}

                {/* Date Added */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Date Added</label>
                  <p className="text-sm">{selectedItem.dateAdded.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="border-t border-border p-6 flex-shrink-0 rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleDeleteItem(selectedItem.id)}
                    className="px-4 py-2 text-sm font-medium bg-red-600/10 text-red-600 hover:bg-red-600/20 hover:text-red-700 rounded-lg transition-all duration-300 hover:scale-105 focus-ring-luxury flex items-center gap-2 border border-red-600/20 hover:border-red-600/30"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    </svg>
                    Delete Item
                  </button>
                  
                  <div className="flex items-center gap-3">
                    {editingInModal ? (
                      <>
                        <button
                          onClick={() => setEditingInModal(false)}
                          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:scale-105 focus-ring-luxury"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setEditingInModal(false)}
                          className="px-4 py-2 text-sm font-medium bg-gold text-black rounded-lg hover:bg-gold/90 transition-all duration-300 hover:scale-105 focus-ring-luxury shadow-lg"
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingInModal(true)}
                        className="px-4 py-2 text-sm font-medium bg-gold text-black rounded-lg hover:bg-gold/90 transition-all duration-300 hover:scale-105 focus-ring-luxury flex items-center gap-2 shadow-lg"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit Item
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Modal - Using New WishlistModal */}
        {showAddForm && (
          <WishlistModal
            onClose={() => setShowAddForm(false)}
            title="Add Dream Item"
            icon="✨"
            size="md"
            footer={
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-muted/20 text-muted-foreground hover:bg-muted/30 hover:text-foreground rounded-xl transition-all duration-300 border border-muted/30 hover:border-muted/50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.name?.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-gold to-gold/80 text-black rounded-xl font-semibold hover:from-gold/90 hover:to-gold/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  ✨ Add Dream
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Dream Item Name
                </label>
                <input
                  type="text"
                  placeholder="What do you dream of? *"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full bg-background/50 border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Tell us about your dream..."
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  className="w-full bg-background/50 border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-300 backdrop-blur-sm resize-none"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold font-bold">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={newItem.price || ''}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || undefined})}
                      className="w-full bg-background/50 border border-gold/20 rounded-xl pl-8 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={newItem.category || 'other'}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value as Category})}
                    className="w-full bg-background/50 border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-300 backdrop-blur-sm"
                  >
                    {Object.entries(categoryEmojis).map(([category, emoji]) => (
                      <option key={category} value={category}>{emoji} {category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Priority
                </label>
                <select
                  value={newItem.priority || 'medium'}
                  onChange={(e) => setNewItem({...newItem, priority: e.target.value as Priority})}
                  className="w-full bg-background/50 border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="low">🔵 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🟠 High Priority</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newItem.url || ''}
                  onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                  className="w-full bg-background/50 border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Personal Notes
                </label>
                <textarea
                  placeholder="Why do you want this? Any special notes..."
                  value={newItem.notes || ''}
                  onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                  className="w-full bg-background/50 border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-300 backdrop-blur-sm resize-none"
                  rows={2}
                />
              </div>

              {/* Preview Card */}
              {(newItem.name || newItem.price) && (
                <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/30 rounded-2xl p-4 mt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{categoryEmojis[newItem.category || 'other']}</span>
                    <div>
                      <h3 className="font-bold text-foreground">{newItem.name || "Your Dream Item"}</h3>
                      {newItem.price && (
                        <p className="text-lg font-bold text-gold">
                          ${newItem.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {newItem.description && (
                    <p className="text-sm text-muted-foreground bg-black/20 rounded-lg p-3 mb-2">
                      💭 {newItem.description}
                    </p>
                  )}
                  {newItem.notes && (
                    <p className="text-xs text-muted-foreground bg-gold/10 rounded-lg p-2">
                      📝 {newItem.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </WishlistModal>
        )}

        <BottomNavigation />
      </div>
    </ProtectedRoute>
  );
}