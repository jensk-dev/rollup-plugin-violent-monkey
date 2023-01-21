import z from "zod";

export const grant = z.enum([
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

export type Grant = z.infer<typeof grant>;

const localeMap = z.record(
  z.string().regex(/^[a-z]{2}-[A-Z]{2}$/).length(5),
  z.string().min(1)
).optional();

export type LocaleMap = z.infer<typeof localeMap>;

const optionalString = z.string().min(1).optional();
const optionalUrl = z.string().url().optional();
const optionalBool = z.boolean().optional();

export const primitiveField = optionalString.or(optionalUrl).or(optionalBool);

/**
 * Specifies when the script should be injected into the page.
 */
export const runAt = z.enum([
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
]);

export const metadata = z.object({
  name: z.string().min(1),
  localizedName: localeMap,
  namespace: optionalString,
  match: optionalString,
  excludeMatch: optionalString,
  include: optionalString,
  exclude: optionalString,
  version: optionalString,
  description: optionalString,
  localizedDescription: localeMap,
  icon: optionalUrl,
  require: optionalUrl,
  resources: z.record(
    z.string().min(1).regex(/^[^\s]+$/),
    z.string().url()
  ).optional(),
  /** Decides when the script will be injected into the page. */
  runAt: runAt.optional(),
  noframes: optionalBool,
  grants: grant.array().optional(),
  injectInto: z.enum(["page", "content", "auto"]).optional(),
  downloadUrl: optionalUrl,
  supportUrl: optionalUrl,
  homepageUrl: optionalUrl,
  unwrap: optionalBool
});

export type Metadata = z.infer<typeof metadata>;

export const metadataKey = metadata.keyof();

export type MetadataKey = z.infer<typeof metadataKey>;
