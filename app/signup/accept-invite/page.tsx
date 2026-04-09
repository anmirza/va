'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getInvitationByToken } from '@/lib/admin-store'
import { VaLogo } from '@/components/va-logo'
import Link from 'next/link'
import { CheckCircle2, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

function AcceptInviteContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const { user, acceptInviteToken } = useAuth()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'accepting' | 'success' | 'error'>('loading')
  const [orgName, setOrgName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { setStatus('error'); setError('No invite token provided.'); return }
    const inv = getInvitationByToken(token)
    if (!inv) { setStatus('error'); setError('This invite link is invalid or has expired.'); return }
    if (inv.status !== 'pending') { setStatus('error'); setError('This invite has already been used.'); return }
    setOrgName(inv.orgName)
    setStatus('accepting')
  }, [token])

  const handleAccept = async () => {
    if (!user) { router.push(`/signup?token=${token}`); return }
    const result = await acceptInviteToken(token)
    if (result.success) {
      setOrgName(result.orgName ?? '')
      setStatus('success')
    } else {
      setStatus('error')
      setError(result.error ?? 'Failed to accept invite.')
    }
  }

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <header className="bg-[#02030E]/95 backdrop-blur-md border-b border-white/[0.06] px-6 py-4">
        <Link href="/"><VaLogo width={62} height={39} /></Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center glass-card p-8 rounded-2xl">
          {status === 'loading' && (
            <><Loader2 className="w-10 h-10 text-[#0763d8] animate-spin mx-auto mb-4" /><p className="text-white/60">Checking invite...</p></>
          )}
          {status === 'accepting' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#0763d8]" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">You've been invited!</h1>
              <p className="text-white/60 text-sm mb-6">
                You have been invited to join <span className="text-white font-medium">{orgName}</span> as a <span className="text-[#0763d8] font-medium">Moderator</span>.
              </p>
              {!user ? (
                <>
                  <p className="text-white/40 text-xs mb-4">Please create an account first to accept this invitation.</p>
                  <Button onClick={() => router.push(`/signup?token=${token}`)} className="w-full h-11 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl">
                    Create Account & Accept
                  </Button>
                </>
              ) : (
                <Button onClick={handleAccept} className="w-full h-11 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl">
                  Accept Invitation
                </Button>
              )}
            </>
          )}
          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome aboard!</h1>
              <p className="text-white/60 text-sm mb-6">You are now a Moderator of <span className="text-white font-medium">{orgName}</span>.</p>
              <Button onClick={() => router.push('/dashboard/vendor')} className="w-full h-11 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl">
                Go to Dashboard
              </Button>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Invalid Invite</h1>
              <p className="text-white/60 text-sm mb-6">{error}</p>
              <Link href="/"><Button variant="outline" className="w-full h-11 border-white/[0.12] text-white/70 hover:text-white rounded-xl">Back to Home</Button></Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#02030E]" />}>
      <AcceptInviteContent />
    </Suspense>
  )
}
