import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Free',
    price: '€0',
    period: 'forever',
    description: 'Perfect for getting started and exploring the platform.',
    color: '#d8dce2',
    cta: 'Get Started',
    ctaHref: '/signup',
    ctaStyle: 'outline',
    features: [
      'Basic agency listing in directory',
      'Up to 3 work samples',
      'Search & browse unlimited',
      'Follow agencies & talent',
      'Save campaigns to library',
      'Access to news & insights',
    ],
    missing: ['Analytics & visitor data', 'Featured placement', 'Video showreel', 'Priority support'],
  },
  {
    name: 'Starter',
    price: '€49',
    period: '/month',
    description: 'Ideal for growing agencies looking to increase visibility.',
    color: '#0763d8',
    highlight: true,
    cta: 'Start Free Trial',
    ctaHref: '/signup/agency',
    ctaStyle: 'filled',
    features: [
      'Everything in Free',
      'Up to 15 work samples',
      'Video showreel embed',
      'Full team member profiles',
      'Client logo showcase',
      'Monthly analytics report',
      'Highlighted in search results',
    ],
    missing: ['Featured homepage placement', 'Priority support & account manager'],
  },
  {
    name: 'Pro',
    price: '€149',
    period: '/month',
    description: 'Maximum visibility and analytics for industry-leading agencies.',
    color: '#f5d742',
    cta: 'Contact Sales',
    ctaHref: '/about',
    ctaStyle: 'yellow',
    features: [
      'Everything in Starter',
      'Unlimited work samples',
      'Featured homepage placement',
      'Top placement in directory & search',
      'Full analytics dashboard',
      'Lead tracking & contact insights',
      'Dedicated account manager',
      'Custom branded profile URL',
      'Export data & reports',
    ],
    missing: [],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Start for free, upgrade when you need more visibility and analytics.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div key={plan.name} className={`relative rounded-2xl p-6 flex flex-col ${plan.highlight ? 'bg-[#2e3843] text-white ring-2 ring-[#0763d8] shadow-lg' : 'bg-white shadow-sm'}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#0763d8] text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-[#1a1a1a]'}`}>{plan.name}</h2>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-[#1a1a1a]'}`}>{plan.price}</span>
                    <span className={plan.highlight ? 'text-white/60' : 'text-[#666]'}>{plan.period}</span>
                  </div>
                  <p className={`text-sm ${plan.highlight ? 'text-white/70' : 'text-[#666]'}`}>{plan.description}</p>
                </div>

                <div className="flex-1 mb-6">
                  <div className="space-y-2.5">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-[#0763d8]' : 'text-[#0763d8]'}`} />
                        <span className={plan.highlight ? 'text-white/90' : 'text-[#444]'}>{f}</span>
                      </div>
                    ))}
                    {plan.missing.map(f => (
                      <div key={f} className="flex items-start gap-2.5 text-sm opacity-40">
                        <span className="w-4 h-4 mt-0.5 shrink-0 flex items-center justify-center">—</span>
                        <span className={plan.highlight ? 'text-white/50' : 'text-[#666]'}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href={plan.ctaHref}>
                  <Button
                    className={`w-full font-medium ${
                      plan.ctaStyle === 'filled'
                        ? 'bg-[#0763d8] hover:bg-[#0655b3] text-white'
                        : plan.ctaStyle === 'yellow'
                        ? 'bg-[#f5d742] hover:bg-[#e6c93c] text-[#1a1a1a]'
                        : 'border-2 border-[#d8dce2] bg-transparent text-[#1a1a1a] hover:bg-[#eef0f3]'
                    }`}
                    variant={plan.ctaStyle === 'outline' ? 'outline' : 'default'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ / CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Need a custom solution?</h2>
            <p className="text-[#666] mb-6">We offer custom enterprise packages for large agency networks and global brands.</p>
            <Link href="/about">
              <Button className="bg-[#2e3843] hover:bg-[#3d4f5e] text-white px-8">Talk to Our Team</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
