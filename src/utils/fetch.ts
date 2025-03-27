import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/utils/auth';

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
export async function fetchApi<T extends Record<string, unknown> | unknown[]>(route: string, config?: NextFetchConfig): Promise<T> {
    const session = await (typeof window === 'undefined' ? getServerSession(authOptions) : getSession());

    const headers = new Headers(config?.headers);

    if (!(config?.body instanceof FormData)) {
        headers.append('Content-Type', 'application/json');
    }

    if (session) {
        headers.append('Authorization', `Bearer ${session.accessToken}`);
    }

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${route}`, { ...config, headers })
        .then(async (resp) => {
            if (!resp.ok) {
                return Promise.reject(new Error(`${resp.url}: ${resp.status} ${resp.statusText}`));
            }

            if (resp.headers.get('Content-Type') === 'application/json') {
                return resp.json();
            }

            return undefined;
        });
}
