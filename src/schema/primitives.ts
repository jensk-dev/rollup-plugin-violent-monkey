import { z } from "zod";

/**
 * A non-empty string value
 */
export const isNonEmptyString = z.string().min(1);
export type NonEmptyString = z.infer<typeof isNonEmptyString>

/**
 * A non-empty string value or undefined
 */
export const isOptNonEmptyString = isNonEmptyString.optional();
export type OptNonEmptyString = z.infer<typeof isOptNonEmptyString>

/**
 * A url string value
 */
export const isUrl = z.string().url();
export type Url = z.infer<typeof isUrl>;

/**
 * A url string value or undefined
 */
export const isOptUrl = isUrl.optional();
export type OptUrl = z.infer<typeof isOptUrl>;

/**
 * A boolean
 */
export const isBool = z.boolean();
export type Bool = z.infer<typeof isBool>;

/**
 * A boolean or undefined
 */
export const isOptBool = isBool.optional();
export type OptBool = z.infer<typeof isOptBool>;

/**
 * See [GM_* APIs](https://violentmonkey.github.io/api/gm/)\
 * \
 * Possible grant values that violent monkey accepts.
 */
export const isGrant = z.enum([
  "GM_info",
  "GM_getValue",
  "GM_setValue",
  "GM_deleteValue",
  "GM_listValues",
  "GM_addValueChangeListener",
  "GM_removeValueChangeListener",
  "GM_getResourceText",
  "GM_getResourceURL",
  "GM_addElement",
  "GM_addStyle",
  "GM_openInTab",
  "GM_registerMenuCommand",
  "GM_unregisterMenuCommand",
  "GM_notification",
  "GM_setClipboard",
  "GM_xmlhttpRequest",
  "GM_download",
  "GM.addStyle",
  "GM.addElement",
  "GM.registerMenuCommand",
  "GM.deleteValue",
  "GM.getResourceUrl",
  "GM.getValue",
  "GM.info",
  "GM.listValues",
  "GM.notification",
  "GM.openInTab",
  "GM.setClipboard",
  "GM.setValue",
  "GM.xmlHttpRequest",
  "window.close",
  "window.focus"
]);
export type Grant = z.infer<typeof isGrant>;

/**
 * Represents a locale identifier, like nl-NL, en-GB, de-DE
 */
export const isLocaleString = z.string().regex(/^[a-z]{2}-[A-Z]{2}$/).length(5);
export type LocaleString = z.infer<typeof isLocaleString>

/**
 * See [@run-at](https://violentmonkey.github.io/api/metadata-block/#run-at)\
 * \
 * Specifies when the script should be injected into the page.
 */
export const isRunAt = z.enum([
  /**
   * The script executes when DOMContentLoaded is fired.
   * At this time, the basic HTML of the page is ready and other resources like images might still be on the way.
   */
  "document-end",
  /**
   * The script executes as soon as possible. There is no guarantee for the script to execute before other scripts in the page.
   * Note: in Greasemonkey v3, the script may be ensured to execute even before HTML is loaded,
   *       but this is impossible for Violentmonkey as a web extension.
   */
  "document-start",
  /**
   * The script executes after DOMContentLoaded is fired.
   */
  "document-idle"
]).default("document-end");
export type RunAt = z.infer<typeof isRunAt>;

/**
 * See [@inject-into](https://violentmonkey.github.io/api/metadata-block/#inject-into)\
 * \
 * Decide which context the script will be injected into.
 * If not set in the metadata block, the default value page will be used. However, you can change the default value in Violentmonkey settings.
 */
export const isInjectInto = z.enum([
  /**
   * Inject into context of the web page.
   * In this mode, unsafeWindow refers to the window object, allowing the script to access JavaScript objects of the web page, just like normal page scripts can.
   */
  "page",
  /**
   * Inject into context of content scripts.
   * In this mode, unsafeWindow refers to the global object in content script. As a result, the script can access and modify the page's DOM, but cannot access JavaScript objects of the web page.
   */
  "content",
  /**
   * Try to inject into context of the web page. If blocked by CSP rules, inject as a content script.
   */
  "auto"
]).default("page");
export type InjectInto = z.infer<typeof isInjectInto>;
