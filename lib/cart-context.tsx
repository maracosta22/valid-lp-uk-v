"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product } from "./products"
import { saveShopifyCart } from "./shopify-checkout"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
  openCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [isCartOpen, setCartOpen] = useState(false)
  const openCart = useCallback(() => setCartOpen(true), [])

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("nordic-haus-cart")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        setItems([])
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("nordic-haus-cart", JSON.stringify(items))
      // Keep a copy of the cart as Shopify variant IDs + quantities
      saveShopifyCart(items)
    }
  }, [items, mounted])

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    // Validate quantity is a valid number
    const validQuantity = Number.isInteger(quantity) ? quantity : Math.round(quantity)
    
    if (validQuantity < 1) {
      removeItem(productId)
      return
    }
    
    // Enforce maximum quantity of 100 per product
    const maxQuantity = 100
    const clampedQuantity = Math.min(validQuantity, maxQuantity)
    
    setItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity: clampedQuantity } : item)))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = item.product.price * item.quantity
    // Round to 2 decimal places to avoid floating point errors
    return sum + Math.round(itemPrice * 100) / 100
  }, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setCartOpen, openCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
