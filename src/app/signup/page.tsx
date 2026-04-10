import { redirect } from 'next/navigation';

export default function SignupPage() {
  // With Google OAuth, signup and login are the same flow
  redirect('/login');
}
