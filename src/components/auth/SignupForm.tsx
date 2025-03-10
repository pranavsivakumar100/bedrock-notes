
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveUser } from '@/lib/storage';
import { toast } from 'sonner';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchTab: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchTab }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate signup - in a real app this would call an API
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, just check if all fields are filled in
      if (name && email && password) {
        // Mock successful signup
        saveUser({
          id: Date.now().toString(),
          name,
          email
        });
        
        toast.success('Account created successfully');
        onSuccess();
      } else {
        toast.error('Please fill in all fields');
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />
      </div>
      
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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </Button>
      
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Button variant="link" onClick={onSwitchTab} className="p-0">
          Login
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
