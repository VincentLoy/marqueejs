import type { MarqueeOptions, ContentValidationResult, ContentValidationOptions } from "../types";
export declare class OptionsValidator {
    static readonly MAX_CLONES = 30;
    static readonly MIN_CLONES = 0;
    static readonly DEFAULT_MAX_LENGTH = 8500;
    private static readonly FORBIDDEN_TAGS;
    private static readonly FORBIDDEN_ATTRIBUTES;
    private static readonly DEFAULT_VALIDATION_OPTIONS;
    static validate(options: MarqueeOptions): MarqueeOptions;
    static validateContentList(contentList: string[], options: MarqueeOptions): ContentValidationResult;
    static validateContentValidationOptions(validationOptions: ContentValidationOptions): void;
    static validateSpeed(speed: number | undefined): void;
    static validateDirection(direction: string | undefined): void;
    static validateGap(gap: number | undefined): void;
    static validateContainerHeight(containerHeight: number | undefined, direction: string | undefined): void;
    static validateKeepOriginalContent(keepOriginalContent: boolean | undefined): void;
    static validateCloneCount(cloneCount: number | "auto"): void;
}
