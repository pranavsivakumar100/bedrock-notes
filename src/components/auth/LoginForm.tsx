
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveUser } from '@/lib/storage';
import { toast } from 'sonner';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchTab: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchTab }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - in a real app this would call an API
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, validate the email and password
      if (!email || !password) {
        toast.error('Please enter both email and password');
        return;
      }
      
      // In a real app, you would validate credentials against a database
      // Here we're just checking that they're not empty and creating a unique user ID based on email
      // Mock successful login with a unique user ID for each email
      const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, '');
      
      saveUser({
        id: userId,
        name: email.split('@')[0],
        email
      });
      
      toast.success('Logged in successfully');
      onSuccess();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button variant="link" size="sm" className="h-auto p-0">
            Forgot password?
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
      
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Button variant="link" onClick={onSwitchTab} className="p-0">
          Sign up
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
