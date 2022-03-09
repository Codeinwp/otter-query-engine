class QueryQA {
    constructor() {
        this.sources = {
            "robert": "https://raw.githubusercontent.com/Soare-Robert-Daniel/otter-blocks-qa-templates/main/"
        };
        this.folder = "blocks";
        this.source = "robert";
    }
    select(folder) {
        this.folder = folder;
        return this;
    }
    where(query) {
        this.query = query;
        return this;
    }
    from(source, url) {
        this.source = source;
        if (url) {
            this.sources[this.source] = url;
        }
        return this;
    }
    take(maxResults, options) {
        this.maxResults = maxResults;
        this.takeQuery = options;
        return this;
    }
    async build() {
        if (this.source === undefined) {
            console.warn("The source is undefined! Use '.from()' function to set a source.");
            return;
        }
        if (this.folder === undefined) {
            console.warn("The folder is undefined! Use '.select()' function to set a folder.");
            return;
        }
        const mainPath = `${this.sources[this.source]}/${this.folder}`;
        const respIndex = await fetch(`${mainPath}/index.json`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!respIndex.ok) {
            console.warn('The repo does not exists!');
            return;
        }
        const index = await respIndex.json();
        let validFiles = index?.files?.filter(file => {
            if (this.query === undefined) {
                return true;
            }
            if (this.query?.names?.includes(file.name)) {
                return true;
            }
            if (this.query.mode === undefined || this.query.mode === "exclusive") {
                if (Array.isArray(this.query?.has)) {
                    return [...(file?.has?.blocks || []), ...(file?.has?.plugins || [])]?.every(blockSlug => this.query?.has?.includes(blockSlug));
                }
                else {
                    if (this.query?.has?.blocks !== undefined && file?.has?.blocks?.every(blockSlug => this.query?.has?.blocks?.includes(blockSlug))) {
                        return true;
                    }
                    if (this.query?.has?.plugins !== undefined && file?.has?.plugins?.every(pluginSlug => this.query?.has?.plugins?.includes(pluginSlug))) {
                        return true;
                    }
                }
            }
            else {
                if (Array.isArray(this.query?.has)) {
                    return [...(file?.has?.blocks || []), ...(file?.has?.plugins || [])]?.some(blockSlug => this.query?.has?.includes(blockSlug));
                }
                else {
                    if (this.query?.has?.blocks !== undefined && file?.has?.blocks?.some(blockSlug => this.query?.has?.blocks?.includes(blockSlug))) {
                        return true;
                    }
                    if (this.query?.has?.plugins !== undefined && file?.has?.plugins?.some(pluginSlug => this.query?.has?.plugins?.includes(pluginSlug))) {
                        return true;
                    }
                }
            }
            return false;
        });
        if (this.takeQuery?.shuffle) {
            validFiles = validFiles
                ?.map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
        }
        if (this.maxResults) {
            validFiles = validFiles?.slice(0, this.maxResults);
        }
        return {
            files: validFiles,
            urls: validFiles?.map(({ name }) => `${mainPath}/${name}.json`)
        };
    }
    async run() {
        const { urls } = (await this.build()) || { urls: [] };
        console.log(`Fetching ${urls?.length} files!`);
        urls?.forEach(url => {
            try {
                setTimeout(() => {
                    fetch(url, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    })
                        .then((res) => {
                        if (res.ok)
                            return res.json();
                        else
                            throw new Error("Status code error :" + res.status);
                    })
                        .then(data => {
                        const block = wp?.blocks?.parse(data?.content);
                        if (block) {
                            wp?.data?.dispatch('core/block-editor')?.insertBlocks(block);
                        }
                    });
                }, Math.floor(Math.random() * 10) * 10);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
if (window || globalThis) {
    // @ts-ignore
    const global = window || globalThis;
    // @ts-ignore
    global.QueryQA = QueryQA;
    // @ts-ignore
    global.queryQA = new QueryQA();
}
export default QueryQA;
