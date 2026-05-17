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
                // Surface the API's error detail and body so callers can react.
                const body = await resp.json().catch(() => null);
                const detail = body && typeof body.detail === 'string' ? body.detail : null;
                const error = new Error(detail ?? `${resp.url}: ${resp.status} ${resp.statusText}`);
                return Promise.reject(Object.assign(error, { status: resp.status, body }));
            }

            if (resp.headers.get('Content-Type') === 'application/json') {
                return resp.json();
            }

            return undefined;
        });
}
