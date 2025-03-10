
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
      
      // For demo purposes, just check if email and password are filled in
      if (email && password) {
        // Mock successful login
        saveUser({
          id: '1',
          name: email.split('@')[0],
          email
        });
        
        toast.success('Logged in successfully');
        onSuccess();
      } else {
        toast.error('Invalid email or password');
      }
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
