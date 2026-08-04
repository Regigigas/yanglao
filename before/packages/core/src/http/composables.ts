// packages/core/src/http/composables.ts
// TanStack Vue Query 封装 — 改进版
// 错误类型透传、loading 状态、自动 silent 取消请求

import {
  useQuery,
  useMutation as useTanstackMutation,
  useQueryClient,
} from '@tanstack/vue-query';
import type { MaybeRef } from 'vue';
import type {
  QueryKey,
  UseQueryOptions,
  UseMutationOptions,
  UseQueryReturnType,
} from '@tanstack/vue-query';
import type { ApiResponse } from '../types/index';
import { isCancelError } from './error';

type Fetcher<T> = () => Promise<{ data: ApiResponse<T> }>;

/**
 * useRequest — GET 查询封装
 *
 * @example
 * const { data, isPending, error } = useRequest(
 *   ['elderly', id],
 *   () => http.get(`/elderly/${id}`),
 *   { staleTime: 60_000 },
 * );
 */
export function useRequest<T>(
  queryKey: MaybeRef<QueryKey>,
  fetcher: Fetcher<T>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>,
): UseQueryReturnType<T, Error> {
  return useQuery<T, Error>({
    queryKey: queryKey as QueryKey,
    queryFn: async () => {
      const res = await fetcher();
      return (res.data as ApiResponse<T>).data;
    },
    // 取消请求不算错误，不向上冒泡
    throwOnError: (err) => !isCancelError(err),
    ...options,
  });
}

/**
 * useMutation — POST/PUT/PATCH/DELETE 变更封装
 *
 * @example
 * const { mutate, isPending } = useMutation(
 *   (data: CreateElderlyDto) => http.post('/elderly', data),
 *   {
 *     onSuccess: () => { message.success('创建成功'); queryClient.invalidateQueries(['elderly']); },
 *     onError: (err) => { message.error(getErrorMessage(err)); },
 *   },
 * );
 */
export function useMutation<TData = unknown, TVariables = void>(
  mutationFn: (
    variables: TVariables,
  ) => Promise<{ data: ApiResponse<TData> }>,
  options?: Omit<
    UseMutationOptions<TData, Error, TVariables>,
    'mutationFn'
  >,
) {
  return useTanstackMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const res = await mutationFn(variables);
      return (res.data as ApiResponse<TData>).data;
    },
    ...options,
  });
}

/**
 * useQueryClient — 透传，方便统一从 @yanglao/core 引入
 */
export { useQueryClient };
