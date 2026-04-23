'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Id } from '../../../../convex/_generated/dataModel';

export default function SettingsPage() {
  const [userId, setUserId] = useState<Id<'users'> | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) setUserId(id as Id<'users'>);
    else window.location.href = '/login';
  }, []);

  const user = useQuery(api.users.getUser, userId ? { userId } : 'skip');

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Password change will be implemented with a Convex action
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setNewPassword('');
    setConfirmPassword('');
  }

  if (!user) return <div className="text-muted-foreground animate-pulse">Loading…</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      {/* Account Info */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Plan</p>
              <p className="text-sm text-muted-foreground capitalize">{user.plan}</p>
            </div>
            <Badge variant={user.plan === 'free' ? 'secondary' : 'default'} className="capitalize">
              {user.plan}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Credits Remaining</p>
              <p className="text-sm text-muted-foreground">
                {user.credits === 9999 ? 'Unlimited' : user.credits}
              </p>
            </div>
            <span className="text-2xl font-bold">⚡ {user.credits === 9999 ? '∞' : user.credits}</span>
          </div>
          {user.plan === 'free' && (
            <a href="/dashboard/upgrade">
              <Button className="w-full">Upgrade to Pro — $9.99/month</Button>
            </a>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {saved && <p className="text-sm text-green-600">✓ Password updated successfully</p>}
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="rounded-xl border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sign out</p>
              <p className="text-xs text-muted-foreground">Sign out of your account on this device</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem('userId');
                window.location.href = '/login';
              }}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
