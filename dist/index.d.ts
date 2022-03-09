declare type FileFeature = {
    blocks?: string[];
    plugins?: string[];
};
declare type WhereQuery = {
    names?: string[];
    has?: string[] | FileFeature;
    mode?: "all" | "exclusive";
};
declare type TakeQuery = {
    shuffle?: boolean;
};
declare class QueryQA {
    private readonly sources;
    private source;
    private folder;
    private query;
    private maxResults;
    private takeQuery;
    constructor();
    select(folder: string): this;
    where(query: WhereQuery): this;
    from(source: string, url?: string): this;
    take(maxResults: number, options: TakeQuery): this;
    build(): Promise<{
        files: {
            name: string;
            has: FileFeature;
        }[] | undefined;
        urls: string[] | undefined;
    } | undefined>;
    run(): Promise<void>;
}
declare global {
    let wp: any;
}
export default QueryQA;
//# sourceMappingURL=index.d.ts.map