import type { AcceptedPlugin, bufio, Response } from './deps.ts';

/**
 * A plugin for **Aleph.js** application.
 */
export interface Plugin {
    /** `name` gives the plugin a name. */
    name?: string
    /** `test` matches the import url. */
    test: RegExp
    /** `acceptHMR` accepts the HMR. */
    acceptHMR?: boolean
    /** `transform` transforms the source content. */
    transform?(content: Uint8Array, url: string): Promise<{ code: string, map?: string, loader?: 'js' | 'ts' | 'jsx' | 'tsx' | 'css' | 'markdown' }>
}

/**
 * The options for **SSR**.
 */
export interface SSROptions {
    /** The fallback html **dynamic routes** (default is '**_fallback_spa.html**'). */
    fallback?: string
    /** A list of RegExp for paths to use **SSR**. */
    include?: RegExp[]
    /** A list of RegExp for paths to skip **SSR**. */
    exclude?: RegExp[]
    /** A list of paths for **dynamic routes** in **SSG**. */
    staticPaths?: string[]
}

/**
 * Config for Aleph.js application.
 */
export interface Config {
    /** `framework` to run your application (default is 'react'). */
    framework?: 'alef' | 'react'
    /** `srcDir` to put your application source code (default is '/'). */
    srcDir?: string
    /** `outputDir` specifies the output directory for `build` command (default is '**dist**'). */
    outputDir?: string
    /** `baseUrl` specifies the path prefix for the application (default is '/'). */
    baseUrl?: string
    /** `reactVersion` specifies the **react version** (default is '17.0.1'). */
    reactVersion?: string
    /** `defaultLocale` specifies the default locale of the application (default is '**en**'). */
    defaultLocale?: string
    /** A list of locales. */
    locales?: string[]
    /** The options for **SSR**. */
    ssr?: boolean | SSROptions
    /** A list of plugin. */
    plugins?: Plugin[]
    /** A list of plugin of PostCSS. */
    postcss?: { plugins: (string | AcceptedPlugin | [string | ((options: Record<string, any>) => AcceptedPlugin), Record<string, any>])[] }
    /** `buildTarget` specifies the build target for **swc** in production mode (default is **es5**). */
    buildTarget?: 'es5' | 'es2015' | 'es2016' | 'es2017' | 'es2018' | 'es2019' | 'es2020'
    /** `env` appends env variables (use `Deno.env.get(key)` to get an env variable) */
    env?: Record<string, string>
}

/**
 * A handler to handle api requests.
 *
 * @param req APIRequest object
 */
export interface APIHandler {
    (req: APIRequest): void
}

/**
 * The raw request object of http request.
 */
export interface ServerRequest {
    readonly url: string
    readonly method: string
    readonly proto: string
    readonly protoMinor: number
    readonly protoMajor: number
    readonly headers: Headers
    readonly conn: Deno.Conn
    readonly r: bufio.BufReader
    readonly w: bufio.BufWriter
    readonly done: Promise<Error | undefined>
    readonly contentLength: number | null
    readonly body: Deno.Reader
    respond(r: Response): Promise<void>
    finalize(): Promise<void>
}

/**
 * The request object of api request.
 */
export interface APIRequest extends ServerRequest {
    readonly pathname: string
    readonly params: Record<string, string>
    readonly query: URLSearchParams
    readonly cookies: ReadonlyMap<string, string>
    /** `status` sets response status of the request. */
    status(code: number): this
    /**
     * `addHeader` adds a new value onto an existing response header of the request, or
     * adds the header if it does not already exist.
     */
    addHeader(key: string, value: string): this
    /**
     * `setHeader` sets a new value for an existing response header of the request, or adds
     * the header if it does not already exist.
     */
    setHeader(key: string, value: string): this
    /** `removeHeader` removes the value for an existing response header of the request.  */
    removeHeader(key: string): this
    /** `send` replies to the request with any content with type */
    send(data: string | Uint8Array | ArrayBuffer, contentType?: string): Promise<void>
    /** `json` replies to the request with a json content */
    json(data: any): Promise<void>
    /** `decodeBody` will return a string, a form-data or any json object  */
    decodeBody(type: "text"): Promise<string>
    decodeBody(type: "json"): Promise<any>
    decodeBody(type: "form-data"): Promise<FormDataBody>
}

/**
 * The Router object of the routing, you can access it with `useRouter()` hook.
 */
export interface RouterURL {
    readonly locale: string
    readonly pathname: string
    readonly pagePath: string
    readonly params: Record<string, string>
    readonly query: URLSearchParams
}

/**
 * The form data body
 */
export interface FormDataBody {
    fields: Record<string, string>;
    files: FormFile[];
    get(key: string): string | undefined;
    getFile(key: string): FormFile | undefined;
}

/**
 * The form file data
 */
export interface FormFile {
    name: string
    content: Uint8Array
    contentType: string
    filename: string
    size: number
}
