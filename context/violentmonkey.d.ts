/**
 * Exports ViolentMonkey's API types
 */

import {
  Info,
  Serializable,
  ListenerID,
  ListenerCallback,
  MenuCommandCallback,
  TabControl,
  OpenTabOptions,
  MenuCommandID,
  MenuCaption,
  NotificationControl,
  RequestDetails,
  RequestControl,
  DownloadOptions,
  HTMLAttributeMap,
  OptionalNode
} from "./violentmonkey/GM";

/* eslint-disable camelcase */
declare global {
  const unsafeWindow: typeof window;

  /** An object that exposes information about the current userscript. */
  const GM_info: Info;

  /**
   * Retrieves a value for current script from storage.
   * @param key {string} - The name for value to load.
   * @param defaultValue {T} - The default value to return if no value exists in the storage.
   */
  function GM_getValue<T>(key: string, defaultValue: T): T | undefined;

  /**
   * Sets a key / value pair for current script to storage.
   * @param key {string} - The unique name for value within this script
   * @param value {T} - The value to be stored, which must be JSON serializable (string, number, boolean, null, or an array/object consisting of these types) so for example you can't store DOM elements or objects with cyclic dependencies.
   */
  function GM_setValue<T extends Serializable>(key: string, value: T): void;

  /**
   * Deletes an existing key / value pair for current script from storage.
   * @param key {string} - The unique name for value within this script.
   */
  function GM_deleteValue(key: string): void;

  /** Returns an array of keys of all available values within this script. */
  function GM_listValues(): string[];

  /**
   * Adds a change listener to the storage and returns the listener ID.
   * @param name {string} - The value to observe
   * @param callback {ListenerCallback<T>} - The function to run when the observed value changes.
   */
  function GM_addValueChangeListener<T>(
    name: string,
    callback: ListenerCallback<T>
  ): ListenerID;

  /**
   * Removes a change listener by its ID.
   * @param listenerId {ListenerID} - The ID of the listener.
   */
  function GM_removeValueChangeListener(listenerId: ListenerID): void;

  /**
   * Retrieves a text resource from the metadata block.
   * @param name {string} - Name of a resource defined in the metadata block.
   */
  function GM_getResourceText(name: string): string | undefined;

  /**
   * Retrieves a `blob:` or `data:` URL of a resource from the metadata block.
   *
   * Note: when setting this URL as src or href of a DOM element,
   * it may fail on some sites with a particularly strict CSP that forbids blob: or data: URLs.
   * Such sites are rare though. The workaround in Chrome is to use GM_addElement,
   * whereas in Firefox you'll have to disable CSP either globally via about:config
   * or by using an additional extension that modifies HTTP headers selectively.
   *
   * @param name {string} - Name of a resource defined in the metadata block.
   * @param isBlobUrl {boolean} - Optional parameter that decides whether to return a `blob:` or `data:` url.
   */
  function GM_getResourceURL(name: string, isBlobUrl: boolean): string | undefined;

  /**
   * Appends and returns an element with the specified attributes.
   * @param parentNode {N | undefined | null} - The parent node to which the new node will be appended. It can be inside ShadowDOM: someElement.shadowRoot.
   * @param tagName {string} -
   * @param attributes {} -
   */
  function GM_addElement(
    parentNode: OptionalNode,
    tagName: keyof HTMLElementTagNameMap,
    attributes?: HTMLAttributeMap
  ): HTMLElement;

  /**
   * Appends and returns a <style> element with the specified CSS.
   * @param css {string} - The CSS to insert inside the style element.
   */
  function GM_addStyle(css: string): HTMLElement;

  /**
   * Opens URL in a new tab. Returns an object that can be used to control the new tab.
   * @param url {string} - The URL to open in a new tab. URL relative to current page is also allowed. Note: Firefox does not support data URLs.
   * @param options {} -
   */
  function GM_openInTab(url: string, options?: OpenTabOptions): TabControl;

  /**
   * Opens URL in a new tab using greasemonkey compatibility. Returns an object that can be used to control the new tab.
   * @param url {string} - The URL to open in a new tab. URL relative to current page is also allowed. Note: Firefox does not support data URLs.
   * @param openInBackground {boolean} -  Open the tab in background. Note, this is a reverse of the first usage method so for example true is the same as { active: false }.
   */
  function GM_openInTab(url: string, openInBackground: boolean): TabControl;

  /**
   * Registers a command in Violentmonkey popup menu.
   * @param caption {string} - The name to show in the popup menu.
   * @param onClick {MenuCommandCallback} - Fired when the command is clicked in the menu.
   */
  function GM_registerMenuCommand(caption: MenuCaption, onClick: MenuCommandCallback): MenuCommandID;

  /**
   * Unregisters a command which has been registered to Violentmonkey popup menu.
   * @param caption {string} - The name of command to unregister.
   */
  function GM_unregisterMenuCommand(caption: MenuCaption): void;

  /**
   * Shows an HTML5 desktop notification.
   * @param options {NotificationControl}
   */
  function GM_notification(options: NotificationOptions): NotificationControl;

  /**
   * Shows an HTML5 desktop notification using separate parameters, compatible with Greasemonkey.
   * @param text - Main text of the notification.
   * @param title - Title of the notification.
   * @param image - URL of an image to show in the notification.
   * @param onclick - Callback when the notification is clicked by user.
   */
  function GM_notification(text: string, title?: string, image?: string, onclick?: () => void): NotificationControl;

  /**
   * Sets data to system clipboard.
   * @param data {string} The data to be copied to system clipboard.
   * @param type {string|null|undefined} The MIME type of data to copy. (default text/plain)
   */
  function GM_setClipboard(data: string, type?: string): void;

  /**
   * Makes a request like XMLHttpRequest, with some special capabilities, not restricted by same-origin policy.
   * @param details {RequestDetails<T>} - Options to define the request.
   */
  function GM_xmlhttpRequest<T>(
    details: RequestDetails<T>
  ): RequestControl;

  /**
   * Downloads a URL to a local file.
   * @param options {DownloadOptions<T>} - Options to define the download request.
   */
  function GM_download<T>(
    options: DownloadOptions<T>
  ): RequestControl;

  /**
   * Downloads a URL to a local file.
   * @param url {string} - The URL to download.
   * @param name {string} - The filename to save to. Folders/subpaths aren't supported yet.
   */
  function GM_download(url: string, name: string): RequestControl;

  const GM: {
    info: Info;
    addStyle(css: string): HTMLElement;
    addElement(
      parentNode: OptionalNode,
      tagName: keyof HTMLElementTagNameMap,
      attributes?: HTMLAttributeMap
    ): HTMLElement;
    registerMenuCommand(
      caption: MenuCaption,
      onClick: MenuCommandCallback
    ): MenuCommandID;
    deleteValue(key: string): Promise<void>;
    getResourceUrl(
      name: string,
      isBlobUrl?: boolean
    ): Promise<string | undefined>;
    getValue<T>(key: string, defaultValue: T): Promise<T | undefined>;
    listValues(): Promise<string[]>;
    notification(
      textOrOptions: NotificationOptions | string,
      title?: string,
      image?: string,
      onclick?: () => void
    ): NotificationControl;
    openInTab(
      url: string,
      optionsOrOpenInBackground: OpenTabOptions | boolean
    ): TabControl;
    setClipboard(data: string, type?: string): void;
    setValue<T extends Serializable>(key: string, value: T): Promise<void>;
    xmlHttpRequest<T>(
      details: RequestDetails<T>
    ): RequestControl;
  };
}

export {};
