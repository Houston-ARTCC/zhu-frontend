import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface NextFetchConfig extends RequestInit {
    next?: {
        revalidate?: number | false;
        tags?: string[];
    };
}

/**
 * Wrapper around `fetch` to access api.zhuartcc.org.
 *
 * ### Return Type
 * The function optionally takes a single type parameter for the de-serialized return type of the API route.
 *
 * ```ts
 * const connections = fetchApi<OnlineConnection[]>('/connections/online/')
 * ```
 *
 * @param route API route following /api (e.g. /connections/online/)
 * @param config Configuration for cache control
 */
export async function fetchApi<T extends object>(route: string, config?: NextFetchConfig): Promise<T> {
    const session = await getServerSession(authOptions);

    let headers;
    if (session) {
        headers = new Headers(config?.headers);
        headers.append('Authorization', `Bearer ${session.access_token}`);
    }

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${route}`, { ...config, headers }).then((res) => res.json());
}
