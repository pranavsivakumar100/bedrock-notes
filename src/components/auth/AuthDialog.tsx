
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogTitle className="sr-only">
          {activeTab === 'login' ? 'Login to your account' : 'Create a new account'}
        </DialogTitle>
        
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
          <TabsList className="grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="p-6">
            <LoginForm onSuccess={onClose} onSwitchTab={() => setActiveTab('signup')} />
          </TabsContent>
          
          <TabsContent value="signup" className="p-6">
            <SignupForm onSuccess={onClose} onSwitchTab={() => setActiveTab('login')} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
