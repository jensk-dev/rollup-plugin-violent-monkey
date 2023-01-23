import { z } from "zod";
import { isGrant, isInjectInto, isLocaleString, isNonEmptyString, isOptBool, isOptNonEmptyString, isRunAt, isUrl } from "./primitives";
import { toMap, toSet } from "./transformers";

/**
 * Parses an array of violentmonkey grants and returns a set with the values
 */
export const isGrants = isGrant.array().transform(toSet);
export type Grants = z.infer<typeof isGrants>;

/**
 * Parses an array of strings and returns a set of the values
 */
export const isNonEmtpyStrings = isNonEmptyString.array().transform(toSet);
export type NonEmtpyStrings = z.infer<typeof isNonEmtpyStrings>;

/**
 * Parses a locale record and returns a map with each locale string matching its value
 */
export const isLocales = z.record(
  isLocaleString,
  isNonEmptyString
).transform(toMap);
export type Locales = z.infer<typeof isLocales>;

/**
 * Parses resources and returns a map with each resource id matching its url
 */
export const isResources = z.record(
  z.string().min(1).regex(/^[^\s]+$/), // matches non-whitespace
  z.string().url()
).transform(toMap);
export type Resources = z.infer<typeof isResources>;

/**
 * Validates an returns an object of primitive schema values
 */
export const isPrimitives = z.object({
  name: isNonEmptyString,
  namespace: isOptNonEmptyString.optional(),
  version: isOptNonEmptyString.optional(),
  description: isOptNonEmptyString.optional(),
  icon: isOptNonEmptyString.optional(),
  downloadUrl: isOptNonEmptyString.optional(),
  supportUrl: isOptNonEmptyString.optional(),
  homepageUrl: isOptNonEmptyString.optional(),
  runAt: isRunAt,
  injectInto: isInjectInto,
  noframes: isOptBool,
  unwrap: isOptBool
});
export type Primitives = z.infer<typeof isPrimitives>;

/**
 * All named complex types of the metadata object.
 */
export const isMaps = z.object({
  localizedName: isLocales.optional(),
  localizedDescription: isLocales.optional(),
  resources: isResources.optional()
});
export type Maps = z.infer<typeof isMaps>;

/**
 * All unnamed complex types of the metadata object.
 */
export const isSets = z.object({
  match: isNonEmtpyStrings.optional(),
  excludeMatch: isNonEmtpyStrings.optional(),
  include: isNonEmtpyStrings.optional(),
  exclude: isNonEmtpyStrings.optional(),
  grants: isGrants.optional(),
  require: isUrl.array().optional()
});
export type Sets = z.infer<typeof isSets>;

export const isMetadata = isPrimitives.merge(isMaps).merge(isSets);
export type RawMetadata = z.input<typeof isMetadata>;
export type Metadata = z.output<typeof isMetadata>;
