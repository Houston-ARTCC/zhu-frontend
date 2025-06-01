interface JWTPayload {
    token_type: 'access' | 'refresh';
    exp: number;
    iat: number;
    jti: string;
    user_id: number;
}

export function parseJwt(token: string): JWTPayload {
    const payload = token.split('.')[1];
    const text = Buffer.from(payload, 'base64').toString();

    return JSON.parse(text);
}
