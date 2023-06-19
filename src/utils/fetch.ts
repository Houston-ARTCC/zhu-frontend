import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
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
    const session = await (typeof window === 'undefined' ? getServerSession(authOptions) : getSession());

    let headers;
    if (session) {
        headers = new Headers(config?.headers);
        headers.append('Authorization', `Bearer ${session.access_token}`);
    }

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${route}`, { ...config, headers })
        .then((res) => (
            // 204 No Content does not send a body
            res.status === 204
                ? undefined
                : res.json()
        ));
}
