import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query'
import {
	roleList
} from '@/services/Call'

// LIST ALL ROLE ACL \\
type ListAllRoleAclResponse = {
	[key: string]: any
}
const fetcListRoleAcl =
	async ({
		queryKey,
	}: any): Promise<ListAllRoleAclResponse> => {
		const [_, page] = queryKey

		const hasil: any = await roleList(page)
		if (!hasil.ok) {
			throw hasil
		}
		return hasil.data.data
	}
export function useListRoleAcl(page: String) {
	return useQuery<ListAllRoleAclResponse>({
		queryKey: ['all-role-acl', page],
		queryFn: fetcListRoleAcl,
		staleTime: 1000 * 60 * 1,
		gcTime: 1000 * 60 * 5,
		retry: 1,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	})
}