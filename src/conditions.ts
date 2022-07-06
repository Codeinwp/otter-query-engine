import {FileFeature, FileStructure, WhereQuery} from "./index";
import {satisfies} from "compare-versions";

type OptionalResult = Boolean | 'unused'
export type WhereCondition = (query: WhereQuery, file: FileStructure) => boolean
export type WhereOptionalCondition = (query: WhereQuery, file: FileStructure) => OptionalResult

export function existsCondition(query: WhereQuery, file: FileStructure): boolean {
    return query === undefined;
}

export function hasName(query: WhereQuery, file: FileStructure): boolean {
    return query?.names?.includes(file.name)
}

export function hasTags(query: WhereQuery, file: FileStructure): OptionalResult {
    if (query?.tags) {
        if (query.mode === undefined || query.mode === "exclusive") {
            return Boolean(file?.tags?.every(blockTag => this.query?.tags?.includes(blockTag)))
        } else {
            return Boolean(file?.tags?.some(blockTags => this.query?.tags?.includes(blockTags)))
        }
    }
    return 'unused';
}

export function hasVersion(query: WhereQuery, file: FileStructure): OptionalResult {
    if (query?.version) {
        return satisfies(file.version, query.version)
    }
    return 'unused';
}

export function hasCondition(query: WhereQuery, file: FileStructure): boolean {
    if (query.mode === undefined || query.mode === "exclusive") {
        if (Array.isArray(query?.has)) {
            return [...(file?.has?.blocks || []), ...(file?.has?.plugins || [])]?.every(blockSlug => (query?.has as string[])?.includes(blockSlug))
        } else {
            if (query?.has?.blocks !== undefined && file?.has?.blocks?.every(blockSlug => (query?.has as FileFeature)?.blocks?.includes(blockSlug))) {
                return true;
            }
            if (query?.has?.plugins !== undefined && file?.has?.plugins?.every(pluginSlug => (query?.has as FileFeature)?.plugins?.includes(pluginSlug))) {
                return true;
            }
        }
    } else {
        if (Array.isArray(query?.has)) {
            return [...(file?.has?.blocks || []), ...(file?.has?.plugins || [])]?.some(blockSlug => (query?.has as string[])?.includes(blockSlug))
        } else {
            if (query?.has?.blocks !== undefined && file?.has?.blocks?.some(blockSlug => (query?.has as FileFeature)?.blocks?.includes(blockSlug))) {
                return true;
            }
            if (query?.has?.plugins !== undefined && file?.has?.plugins?.some(pluginSlug => (query?.has as FileFeature)?.plugins?.includes(pluginSlug))) {
                return true;
            }
        }
    }
    return false;
}