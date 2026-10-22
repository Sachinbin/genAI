import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  register,
  login,
getMe,
    logout,
} from '../api/authApi.js';

export const authKeys = {
  all: ['auth'],
  me: ['auth', 'me'],
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
    retry: false,
    staleTime: 60 * 1000,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
};
 export const useRegister = () => {
  const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.me, data.user);
        },
    });
}

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.setQueryData(authKeys.me, null);
      queryClient.clear();
    },
  });
};
