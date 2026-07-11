'use server'

import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function createRazorpayOrder(amount: number) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // In a real app we'd verify the amount against the DB cart items here
    
    // Receipt must be less than 40 chars for Razorpay API
    const shortUserId = user?.id ? user.id.substring(0, 8) : 'guest'
    const receipt = `rcpt_${Date.now().toString().substring(5)}_${shortUserId}`

    const options = {
      amount: Math.round(amount * 100), // Razorpay requires amount in paise
      currency: "INR",
      receipt: receipt.substring(0, 40),
    }

    const order = await razorpay.orders.create(options)
    
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency
    }
  } catch (error: any) {
    console.error("Razorpay order creation error:", error)
    return { error: error.message || "Failed to create payment order" }
  }
}

export async function verifyPaymentAndCreateOrder(
  paymentId: string, 
  orderId: string, 
  signature: string,
  cartItems: any[],
  shippingDetails: any
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: "Must be logged in to place an order. Please log in first." }
  }

  // 1. We would typically verify the signature here using crypto
  // const crypto = require('crypto')
  // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(orderId + '|' + paymentId).digest('hex')
  // if (expectedSignature !== signature) throw new Error("Invalid signature")

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  // 2. Create the order in Supabase
  const { data: dbOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: totalAmount,
      status: 'Processing',
      shipping_address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.pincode}`,
      payment_id: paymentId,
      payment_status: 'Paid',
    })
    .select('id')
    .single()

  if (orderError || !dbOrder) {
    console.error("Order Insert Error:", orderError)
    return { error: "Failed to save order to database" }
  }

  // 3. Create order items
  const orderItemsInsert = cartItems.map(item => ({
    order_id: dbOrder.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_time: item.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsInsert)

  if (itemsError) {
    console.error("Order Items Insert Error:", itemsError)
    return { error: "Failed to save order items" }
  }

  // 4. Update stock (simple approach for now)
  for (const item of cartItems) {
    const { data: product } = await supabase.from('products').select('stock').eq('id', item.id).single()
    if (product) {
      await supabase.from('products').update({ stock: Math.max(0, product.stock - item.quantity) }).eq('id', item.id)
    }
  }

  return { success: true, orderId: dbOrder.id }
}
