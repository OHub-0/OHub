import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';



export type LoginCredentials = {
  id: string,
  password: string
  type: 'username' | 'mobile'
}

export const useLoginMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // This is required to receive httpOnly cookies
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.message || 'Something went wrong.';
        throw new Error(message);
      }

      return res.json(); // returns { message: "Logged in successfully" }
    },

    onSuccess: async (data) => {
      toast.success(data.message); // "Logged in successfully"
      //revalidate/recall me api,
      // queryClient.removeQueries({ queryKey: ['me'] });
      await queryClient.invalidateQueries({ queryKey: ['me'] }); //says the 'me' current data is invalid
      await queryClient.refetchQueries({ queryKey: ['me'] }); // refetches immediately
      router.push('/dashboard');
    },

    onError: (error: any) => {
      toast.error('Login Failed', {
        description: error.message,
      });
    },
  });
};
