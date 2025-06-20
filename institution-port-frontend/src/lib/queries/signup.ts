
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import { toast } from "sonner"

export type SignUpCredentials = {
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  country: string;
  phoneNumber: string;
  password: string;
}


export default function useSignUpMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['signup'],
    mutationFn: async (data: SignUpCredentials) => {
      const res = await fetch('/api/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.message || 'Something went wrong.';
        throw new Error(message);
      }
      return res.json()
    },
    onSuccess: async (data) => {
      toast.success(data.message)
      await queryClient.invalidateQueries({ queryKey: ['me'] }); //says the 'me' current data is invalid
      await queryClient.refetchQueries({ queryKey: ['me'] }); // refetches immediately
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error("Signup failed", {
        description: error.message
      })
    }
  })
}