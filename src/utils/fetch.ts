interface NextFetchConfig {
    cache?: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload';
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
export function fetchApi<T extends object>(route: string, config?: NextFetchConfig): Promise<T> {
    return fetch(`${process.env.ZHU_API_URL}/api${route}`, config).then((res) => res.json());
}
