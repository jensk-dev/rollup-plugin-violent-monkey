type Arch = "arm" | "mips" | "mips64" | "x86-32" | "x86-64";
type BrowserName = "chrome" | "firefox" | string;
type OS = "android" | "cros" | "linux" | "mac" | "openbsd" | "win";

type Platform = {
    arch: Arch;
    browserName: BrowserName;
    browserVersion: string;
    os: OS
};

type Resource = {
    name: string;
    url: string;
}

type Script = {
    description: string;
    excludes: string[];
    includes: string[];
    matches: string[];
    name: string;
    namespace: string;
    resources: Resource[];
    runAt: string;
    version: string;
}

export type Info = {
    /** A unique ID of the script. */
    uuid: string;
    /** The meta block of the script. */
    scriptMetaStr: string;
    /** Whether the script will be updated automatically. */
    scriptWillUpdate: string;
    /** The name of userscript manager, which should be the string Violentmonkey. */
    scriptHandler: string;
    /** Version of Violentmonkey. */
    version: string;
    /**
     * Unlike navigator.userAgent, which can be overriden by other extensions/userscripts or by devtools in device-emulation mode,
     * GM_info.platform is more reliable as the data is obtained in the background page of Violentmonkey using a specialized
     * extension API (browser.runtime.getPlatformInfo and getBrowserInfo).
     */
    platform: Platform;
    /** Contains structured fields from the Metadata Block. */
    script: Script;
    /** The injection mode of current script. See @inject-mode for more information. */
    injectInto: string;
};

type Primitive = string | number | boolean | null;
export type Serializable = Primitive | Array<Serializable> | { [key: string]: Serializable };

/**
 * Identifies an active value listener.
 */
export type ListenerID = string;

/**
 * A function that is executed when the associated key changes.
 * @param key {string} - The name of the stored variable.
 * @param oldValue {string} - The old value of the observed variable (undefined if it was created).
 * @param newValue {string} - The new value of the observed variable (undefined if it was deleted).
 * @param remote {boolean} - true if modified by the userscript instance of another tab or false for this script instance. Can be used by scripts of different browser tabs to communicate with each other.
 */
export type ListenerCallback<T> = (
    key: string,
    oldValue: T,
    newValue: T,
    remote: boolean
) => unknown;

export type OptionalNode = Node | Element | ShadowRoot | null | undefined;
export type HTMLAttributeMap = {
    [attribute: string]: string
};

export type OpenTabOptions = {
    /**
     * Make the new tab active (i.e. open in foreground). Defaults to `true`
     */
    active?: boolean;
    /**
     * Set tab's container in Firefox. See [GM_openInTab](https://violentmonkey.github.io/api/gm/#gm_openintab)
     */
    container?: 0 | 1 | 2;
    /**
     * Insert the new tab next to the current tab and set its "openerTab"
     * so when it's closed the original tab will be focused automatically.
     * When false or not specified, the usual browser behavior is to
     * open the tab at the end of the tab list.
     */
    insert: boolean;
    /**
     * Pin the tab (i.e. show without a title at the beginning of the tab list).
     */
    pinned: boolean;
};

export type TabControl = {
    onclose: (() => unknown) | null;
    closed: boolean;
    close(): unknown;
};

export type MenuCommandCallback = (event: MouseEvent | KeyboardEvent) => unknown;
export type MenuCommandID = string;
export type MenuCaption = string;

export type NotificationOptions = {
    // Main text of the notification.
    text: string;
    // Title of the notification.
    title?: string;
    // URL of an image to show in the notification.
    image?: string;
    // Callback when the notification is clicked by user.
    onclick?: () => void;
    // Callback when the notification is closed, either by user or by system.
    ondone?: () => void;
};

export type NotificationControl = {
    remove: () => Promise<void>;
};

export type Request<T> = {
    status: number;
    statusText: string;
    readyState: number;
    responseHeaders: string;
    response: string | Blob | ArrayBuffer | Document | object | null;
    responseText: string | undefined; // only provided when available
    responseXML?: Document | null; // only provided when available
    lengthComputable?: boolean; // only provided when available
    loaded?: number; // only provided when available
    total?: number; // only provided when available
    finalUrl: string; // the final URL after redirection,
    context: T; // the same context object you specified in details
};

export type RequestBase<T> = {
    /**
     * URL relative to current page is also allowed.
     */
    url: string;

    /**
     * User for authentication.
     */
    user?: string;

    /**
     * Password for authentication.
     */
    password?: string;

    /**
     * See [GM_xmlhttpRequest](https://violentmonkey.github.io/api/gm/#gm_xmlhttprequest)
     */
    headers?: { [header: string]: string };

    /**
     * Time to wait for the request, none by default.
     */
    timeout?: number;

    /**
     * Can be an object and will be assigned to context of the response object.
     */
    context?: T;

    /**
     * When set to true, no cookie will be sent with the request and since VM2.12.5 the response cookies will be ignored.
     * When absent, an inverted value of Greasemonkey4-compatible withCredentials is used. Note that Violentmonkey sends cookies by default, like Tampermonkey, but unlike Greasemonkey4 (same-origin url only).
     */
    anonymous?: boolean;

    // Each event handler is a function that accepts one argument responseObject
    onabort?: <T>(responseObject: Request<T>) => void;
    onerror?: <T>(responseObject: Request<T>) => void;
    onload?: <T>(responseObject: Request<T>) => void;
    onloadend?: <T>(responseObject: Request<T>) => void;
    onloadstart?: <T>(responseObject: Request<T>) => void;
    onprogress?: <T>(responseObject: Request<T>) => void;
    onreadystatechange?: <T>(responseObject: Request<T>) => void;
    ontimeout?: <T>(responseObject: Request<T>) => void;
};

export type RequestDetails<T> = RequestBase<T> & {
    // Usually GET.
    method?: string;
    // A MIME type to specify with the request.
    overrideMimeType?: string;

    responseType?: "text" | "json" | "blob" | "arraybuffer" | "document";

    // Data to send with the request, usually for POST and PUT requests.
    data?:
      | string
      | ArrayBuffer
      | Blob
      | DataView
      | FormData
      | ReadableStream
      | URLSearchParams;

    // Send the data string as a blob. This is for compatibility with Tampermonkey/Greasemonkey, where only string type is allowed in data.
    binary?: boolean;
};

export type RequestControl = {
    abort: () => void;
};

export type DownloadOptions<T> = RequestBase<T> & {
    name: string
};
