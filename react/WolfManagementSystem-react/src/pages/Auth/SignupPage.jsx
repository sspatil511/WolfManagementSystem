import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { registerUser } from '@/api/authApi';

const MIN_LENGTH = 8;

const REQUIREMENTS = [
  {
    id: 'length',
    label: `At least ${MIN_LENGTH} characters`,
    test: (p) => p.length >= MIN_LENGTH,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter (A–Z)',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter (a–z)',
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: 'number',
    label: 'One number (0–9)',
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: 'symbol',
    label: 'One symbol (!@#$%^&* …)',
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

const STRENGTH_LEVELS = [
  { label: 'Very weak',  color: '#e24b4a' },
  { label: 'Weak',       color: '#ef9f27' },
  { label: 'Fair',       color: '#efc027' },
  { label: 'Strong',     color: '#639922' },
  { label: 'Very strong',color: '#1d9e75' },
];

function usePasswordStrength(password) {
  return useMemo(() => {
    if (!password) return { score: 0, passed: [], failed: REQUIREMENTS.map(r => r.id) };

    const passed = REQUIREMENTS.filter(r => r.test(password)).map(r => r.id);
    const failed = REQUIREMENTS.filter(r => !r.test(password)).map(r => r.id);

    let score = passed.length;

    if (password.length >= 16) score = Math.min(score + 1, 5);
    if (/[^A-Za-z0-9].*[^A-Za-z0-9]/.test(password)) score = Math.min(score + 1, 5);

    score = Math.min(score, 5);

    return { score, passed, failed };
  }, [password]);
}

export const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const { score, passed, failed } = usePasswordStrength(password);

  const allRequirementsMet = failed.length === 0;

  const strengthLevel = password.length === 0
    ? null
    : STRENGTH_LEVELS[Math.max(0, Math.min(score - 1, 4))];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allRequirementsMet) {
      setError('Please satisfy all password requirements before continuing.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(fullName, email, password);
      login(res.data.jwt);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Fill in the details below to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!passwordTouched) setPasswordTouched(true);
                  }}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" />
                    : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {passwordTouched && (
                <div className="flex flex-col gap-3 pt-1">

                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((segment) => (
                        <div
                          key={segment}
                          className="h-1.5 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor:
                              score >= segment && strengthLevel
                                ? strengthLevel.color
                                : 'hsl(var(--muted))',
                          }}
                        />
                      ))}
                    </div>
                    {strengthLevel && (
                      <p
                        className="text-xs font-medium transition-colors duration-300"
                        style={{ color: strengthLevel.color }}
                      >
                        {strengthLevel.label}
                      </p>
                    )}
                  </div>

                  <ul className="flex flex-col gap-1.5">
                    {REQUIREMENTS.map((req) => {
                      const isPassed = passed.includes(req.id);
                      return (
                        <li
                          key={req.id}
                          className="flex items-center gap-2 text-xs transition-colors duration-200"
                          style={{
                            color: isPassed
                              ? 'hsl(var(--foreground))'
                              : 'hsl(var(--muted-foreground))',
                          }}
                        >
                          {isPassed
                            ? <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                            : <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                          {req.label}
                        </li>
                      );
                    })}
                  </ul>

                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || (passwordTouched && !allRequirementsMet)}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>

          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};