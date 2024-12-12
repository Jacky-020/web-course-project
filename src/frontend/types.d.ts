declare function fetch(
    input: string | URL | globalThis.Request,
    init?: RequestInit,
    guarded?: boolean,
): Promise<Response>;
