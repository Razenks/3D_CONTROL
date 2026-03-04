import React from 'react';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border-t-4 border-[#FF9B54]">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
}