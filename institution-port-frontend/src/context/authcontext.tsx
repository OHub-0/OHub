// 'use client';

// import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
// import { checkMe } from '@/lib/queries/checkme';
// import { toast } from 'sonner';

// type AuthContextType = {
//   user: string | null;
//   // setUser: (user: string | null) => void;
// };

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   // setUser: () => { },
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const { data } = checkMe();
//   // const [user, setUser] = useState<string | null>(null);

//   return (
//     <AuthContext.Provider value={{ user: data?.user ?? null }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);