import React, { useState, useCallback } from 'react';
import { Mail, Send, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { inviteToProject } from '@/api/authApi';

// ─── Trusted email domains ────────────────────────────────────────────────────
// A curated list of well-known, reputable email providers.
// Extend this list as needed.
const TRUSTED_DOMAINS = new Set([
  // Google
  'gmail.com', 'googlemail.com',
  // Microsoft
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'outlook.co.uk',
  'hotmail.co.uk', 'hotmail.fr', 'live.co.uk', 'live.fr', 'windowslive.com',
  // Yahoo
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.es',
  'yahoo.it', 'yahoo.co.jp', 'yahoo.com.br', 'yahoo.com.au', 'yahoo.ca',
  'ymail.com', 'rocketmail.com',
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  // Other major providers
  'protonmail.com', 'proton.me',
  'tutanota.com', 'tuta.com',
  'fastmail.com', 'fastmail.fm',
  'zoho.com', 'zohomail.com',
  'aol.com', 'aim.com',
  'mail.com', 'email.com', 'usa.com',
  'gmx.com', 'gmx.net', 'gmx.de',
  'web.de', 'freenet.de', 't-online.de',
  'libero.it', 'virgilio.it',
  'orange.fr', 'laposte.net', 'free.fr', 'sfr.fr', 'wanadoo.fr',
  'rediffmail.com',
  'naver.com', 'daum.net', 'hanmail.net',
  'qq.com', '163.com', '126.com', 'sina.com',
  'yandex.com', 'yandex.ru', 'mail.ru', 'inbox.ru', 'list.ru',
  'rambler.ru',
]);

// ─── Validation helpers ───────────────────────────────────────────────────────

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Validates the email address and returns an error message string,
 * or null if the address is valid.
 */
function validateEmail(email) {
  const trimmed = email.trim();

  if (!trimmed) return 'Email address is required.';

  if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address.';

  const domain = trimmed.split('@')[1]?.toLowerCase();

  if (!domain) return 'Please enter a valid email address.';

  // Reject obviously disposable / temporary mail patterns
  if (
    domain.includes('tempmail') ||
    domain.includes('throwaway') ||
    domain.includes('mailinator') ||
    domain.includes('guerrillamail') ||
    domain.includes('sharklasers') ||
    domain.includes('dispostable') ||
    domain.includes('yopmail') ||
    domain.includes('trashmail')
  ) {
    return 'Disposable email addresses are not allowed.';
  }

  if (!TRUSTED_DOMAINS.has(domain)) {
    return `"${domain}" is not a recognised email provider. Please use a trusted service such as Gmail, Outlook, or Yahoo.`;
  }

  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * InviteDialog
 *
 * Props:
 *  open        boolean   — controls dialog visibility
 *  onClose     () => void
 *  projectId   number    — the project to invite into
 *  projectName string    — displayed in the dialog heading
 *  currentUserEmail string — so we can prevent self-invite
 *  existingTeamEmails string[] — so we can prevent duplicate invites
 */
export const InviteDialog = ({
  open,
  onClose,
  projectId,
  projectName,
  currentUserEmail = '',
  existingTeamEmails = [],
}) => {
  const [email, setEmail]           = useState('');
  const [fieldError, setFieldError] = useState('');
  const [status, setStatus]         = useState('idle'); // idle | loading | success | error
  const [apiError, setApiError]     = useState('');

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleClose = useCallback(() => {
    setEmail('');
    setFieldError('');
    setStatus('idle');
    setApiError('');
    onClose();
  }, [onClose]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear field-level error as the user types
    if (fieldError) setFieldError('');
    if (status === 'error') setStatus('idle');
  };

  const handleSend = useCallback(async () => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Format + domain validation
    const validationError = validateEmail(trimmedEmail);
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    // 2. Self-invite guard
    if (trimmedEmail === currentUserEmail.toLowerCase()) {
      setFieldError("You can't invite yourself.");
      return;
    }

    // 3. Already-a-member guard
    if (existingTeamEmails.map((e) => e.toLowerCase()).includes(trimmedEmail)) {
      setFieldError('This person is already a member of the project.');
      return;
    }

    setStatus('loading');
    setApiError('');

    try {
      await inviteToProject(projectId, trimmedEmail);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setApiError(
        err.response?.data?.message ||
          'Failed to send invitation. Please try again.'
      );
    }
  }, [email, projectId, currentUserEmail, existingTeamEmails]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && status !== 'loading') handleSend();
  };

  // ── Derived UI state ──────────────────────────────────────────────────────
  const domain = email.includes('@') ? email.split('@')[1]?.toLowerCase() : null;
  const isDomainKnown = domain ? TRUSTED_DOMAINS.has(domain) : null;
  const showDomainHint = domain && domain.length > 1 && status === 'idle';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md" aria-describedby="invite-dialog-desc">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Invite to {projectName}
          </DialogTitle>
          <DialogDescription id="invite-dialog-desc">
            Send an email invitation to add someone to this project. They'll
            receive a link to accept or decline.
          </DialogDescription>
        </DialogHeader>

        {/* ── Success state ── */}
        {status === 'success' ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold">Invitation sent!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                An invite was sent to{' '}
                <span className="font-medium text-foreground">
                  {email.trim().toLowerCase()}
                </span>
                .
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={() => { setEmail(''); setStatus('idle'); }}>
                Invite another
              </Button>
              <Button onClick={handleClose}>Done</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-email">
                  Email address
                  <span className="ml-1 text-destructive">*</span>
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@gmail.com"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyDown}
                    disabled={status === 'loading'}
                    aria-invalid={!!fieldError}
                    aria-describedby={fieldError ? 'invite-email-error' : undefined}
                    className={`pl-9 pr-9 ${fieldError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    autoComplete="email"
                    autoFocus
                  />
                  {email && (
                    <button
                      type="button"
                      onClick={() => { setEmail(''); setFieldError(''); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Clear email"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Field-level validation error */}
                {fieldError && (
                  <p
                    id="invite-email-error"
                    role="alert"
                    className="flex items-center gap-1.5 text-xs text-destructive"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {fieldError}
                  </p>
                )}

                {/* Live domain hint (only when no error and domain is being typed) */}
                {!fieldError && showDomainHint && (
                  <p
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      isDomainKnown
                        ? 'text-emerald-400'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {isDomainKnown ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    )}
                    {isDomainKnown
                      ? `${domain} is a recognised email provider.`
                      : `${domain} is not in our list of trusted providers.`}
                  </p>
                )}
              </div>

              {/* Accepted providers hint */}
              <div className="rounded-lg bg-muted/50 px-4 py-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Accepted email providers include:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Gmail', 'Outlook', 'Yahoo', 'iCloud', 'ProtonMail', 'Fastmail', 'Zoho', 'Yandex'].map(
                    (provider) => (
                      <Badge key={provider} variant="secondary" className="text-xs font-normal">
                        {provider}
                      </Badge>
                    )
                  )}
                  <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
                    + more
                  </Badge>
                </div>
              </div>

              {/* API-level error */}
              {status === 'error' && apiError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  {apiError}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose} disabled={status === 'loading'}>
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={!email.trim() || status === 'loading'}
                className="gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send invite
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};