"use client"

import type React from "react"
import { useState } from "react"
import { Mail, MapPin, Clock, ChevronDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { identifyUser } from "@/lib/tiktok-events"

const faqs = [
  {
    question: "Which countries do you deliver to?",
    answer:
      "We deliver throughout the United Kingdom and to most European countries. Delivery is free for all orders over £80 in the UK. For other countries, delivery charges are calculated at checkout.",
  },
  {
    question: "What is your returns policy?",
    answer:
      "We offer a 30-day returns policy on all unused items in their original packaging. Simply contact us to initiate a return, and we will provide you with a prepaid shipping label. Refunds are processed within 5-7 business days after receiving the item.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 5-10 business days. Express delivery (£15) delivers within 2-4 business days. All orders are dispatched from our warehouse in the UK.",
  },
  {
    question: "How do I care for my wood products?",
    answer:
      "Our wood products are finished with natural oils that protect and enhance the grain. Dust regularly with a soft cloth. For deeper cleaning, use a damp cloth and dry immediately. Avoid direct sunlight and heat sources. We recommend re-oiling annually with our Wood Care Kit.",
  },
  {
    question: "Do you offer installation services?",
    answer:
      "Our wall panels come with comprehensive installation guides and all necessary hardware. For professional installation, we work with certified installers in major UK cities. Contact us for a quote.",
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>
      <div className={cn("grid transition-all duration-200", isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <p className="text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // TikTok: Identify user with email from contact form (for future event matching)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    if (email) {
      await identifyUser({ email: email.trim() })
    }
    
    setSubmitted(true)
  }

  return (
    <div className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-4xl sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-muted-foreground">
            Have a question about our products or your order? We are here to help.
          </p>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-2xl">Send Us a Message</h2>
            {submitted ? (
              <div className="mt-8 rounded-sm bg-secondary p-8 text-center">
                <h3 className="font-serif text-xl">Thank you for your message!</h3>
                <p className="mt-4 text-muted-foreground">
                  We will get back to you within 24-48 hours during business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required className="h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" required className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={6} required className="resize-none" />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl">Contact Information</h2>
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4 rounded-sm border border-border bg-secondary p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
                  <MessageCircle className="h-5 w-5 text-foreground" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium">Problems with your delivery?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Message us on WhatsApp for fast support, 24 hours a day.
                  </p>
                  <a
                    href="https://wa.me/447564453579"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-medium text-foreground hover:underline"
                  >
                    +44 7564 453579
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a href="mailto:contact@slaturawood.co.uk" className="mt-1 text-muted-foreground hover:underline">
                    contact@slaturawood.co.uk
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="mt-1 text-muted-foreground">
                    SLATURA WOOD LTD
                    <br />
                    123 Design Street
                    <br />
                    London EC1A 1BB
                    <br />
                    United Kingdom
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Opening Hours</h3>
                  <p className="mt-1 text-muted-foreground">
                    Monday - Friday: 9:00am - 5:00pm
                    <br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div id="shipping" className="mt-12 border-t border-border pt-8">
              <h3 className="font-serif text-xl">Delivery Information</h3>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Free Standard Delivery:</span> All UK orders over £80
                </p>
                <p>
                  <span className="font-medium text-foreground">Express Delivery:</span> £15 (2-4 business days)
                </p>
                <p>
                  <span className="font-medium text-foreground">EU & International:</span> From £25
                </p>
              </div>
            </div>

            {/* Returns Info */}
            <div id="returns" className="mt-8 border-t border-border pt-8">
              <h3 className="font-serif text-xl">Returns & Exchanges</h3>
              <p className="mt-4 text-sm text-muted-foreground">
                We want you to love your purchase. If you are not completely satisfied, return unused items within
                30 days for a full refund. Contact us at contact@slaturawood.co.uk to start your return.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section id="faq" className="mt-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-serif text-3xl">Frequently Asked Questions</h2>
            <div className="mt-8">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* Care Guide */}
        <section id="care" className="mt-24 border-t border-border pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl">Product Care Guide</h2>
            <p className="mt-4 text-muted-foreground">
              Our products are designed to last. With proper care, they will become even more beautiful over time.
            </p>
            <div className="mt-8 grid gap-6 text-left sm:grid-cols-2">
              <div className="bg-secondary p-6">
                <h3 className="font-medium">Wood Products</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>- Dust regularly with a soft, dry cloth</li>
                  <li>- Avoid direct sunlight and heat sources</li>
                  <li>- Clean with a slightly damp cloth if necessary</li>
                  <li>- Re-oil annually for best results</li>
                </ul>
              </div>
              <div className="bg-secondary p-6">
                <h3 className="font-medium">Ceramic & Glass</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>- Hand wash with mild soap</li>
                  <li>- Avoid extreme temperature changes</li>
                  <li>- Handle with care - each piece is unique</li>
                  <li>- Use felt pads on surfaces</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
