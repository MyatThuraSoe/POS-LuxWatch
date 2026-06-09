import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, Wallet, User, Clock, Barcode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const POSPage: React.FC = () => {
  const [products] = useState<Product[]>([
    { id: 1, name: 'Rolex Submariner', price: 12999.99, stock: 5, sku: 'RLX-SUB-001', category: 'Classic' },
    { id: 2, name: 'Apple Watch Ultra', price: 799.99, stock: 15, sku: 'APL-Ultra-001', category: 'Smart' },
    { id: 3, name: 'Omega Seamaster', price: 5499.99, stock: 8, sku: 'OMG-SEA-001', category: 'Classic' },
    { id: 4, name: 'Samsung Galaxy Watch 6', price: 329.99, stock: 20, sku: 'SAM-GW6-001', category: 'Smart' },
    { id: 5, name: 'TAG Heuer Carrera', price: 4999.99, stock: 6, sku: 'TAG-CAR-001', category: 'Classic' },
    { id: 6, name: 'Garmin Fenix 7', price: 699.99, stock: 12, sku: 'GAR-FNX-001', category: 'Smart' },
    { id: 7, name: 'Breitling Navitimer', price: 8999.99, stock: 3, sku: 'BRE-NAV-001', category: 'Classic' },
    { id: 8, name: 'Fitbit Sense 2', price: 249.99, stock: 25, sku: 'FIT-SNS-001', category: 'Smart' },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mixed'>('cash');
  const { toast } = useToast();

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({ title: "Warning", description: "Cannot add more than available stock", variant: "destructive" });
        return;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        if (newQty > item.stock) {
          toast({ title: "Warning", description: "Cannot exceed available stock", variant: "destructive" });
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setDiscount(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const tax = (subtotal - discountAmount) * 0.085;
  const total = subtotal - discountAmount + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({ title: "Error", description: "Cart is empty", variant: "destructive" });
      return;
    }
    setIsCheckoutOpen(true);
  };

  const completeSale = () => {
    toast({ title: "Success", description: `Sale completed! Total: $${total.toFixed(2)}` });
    setIsCheckoutOpen(false);
    clearCart();
  };

  const handleBarcodeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const product = products.find((p: Product) => p.sku === target.value);
      if (product) {
        addToCart(product);
        target.value = '';
        toast({ title: "Added", description: `${product.name} added to cart` });
      } else {
        toast({ title: "Not Found", description: "Product not found", variant: "destructive" });
      }
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Side - Products */}
      <div className="flex-1 p-4 overflow-hidden">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Input
                placeholder="Scan barcode"
                onKeyDown={handleBarcodeScan}
                className="w-48"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </Badge>
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.sku}</p>
                      <p className="text-lg font-bold">${product.price.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Cart */}
      <div className="w-96 border-l bg-card p-4 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Current Sale
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Customer name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="text-sm"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-2">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Cart is empty</p>
                <p className="text-sm">Add products to start a sale</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <Separator />
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                className="w-20"
              />
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount:</span>
                <span className="text-green-500">-${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8.5%):</span>
                <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" onClick={clearCart} disabled={cart.length === 0}>
                Clear
              </Button>
              <Button onClick={handleCheckout} disabled={cart.length === 0} className="bg-green-600 hover:bg-green-700">
                Checkout
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={() => toast({ title: "Info", description: "Hold cart feature coming soon" })}>
              <Clock className="mr-2 h-4 w-4" /> Hold Cart
            </Button>
          </div>
        </Card>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {customerName && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{customerName}</p>
              </div>
            )}
            <div className="text-2xl font-bold text-center py-4">
              Total: ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div>
              <Label>Payment Method</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className="flex flex-col items-center py-4"
                >
                  <Banknote className="h-6 w-6 mb-2" />
                  Cash
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="flex flex-col items-center py-4"
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  Card
                </Button>
                <Button
                  variant={paymentMethod === 'mixed' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('mixed')}
                  className="flex flex-col items-center py-4"
                >
                  <Wallet className="h-6 w-6 mb-2" />
                  Mixed
                </Button>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsCheckoutOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={completeSale}>
                Complete Sale
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POSPage;
