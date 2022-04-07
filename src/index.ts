import { satisfies } from 'compare-versions';

type FileFeature = {
    blocks?: string[],
    plugins?: string[]
}

type WhereQuery = {
    names?: string[],
    has?: string[] | FileFeature,
    mode?: "all" | "exclusive",
    tags?: string[]
    version?: string
}

type TakeQuery = {
    shuffle?: boolean,
}

type FilesStructure = {
    files?: {
        name: string,
        has: FileFeature,
        tags?: string[]
        comment?: string
        version?: string
    }[]
}

class QueryQA {
    private readonly sources: { [key: string]: string };
    private source: string;
    private folder: string;
    private query: WhereQuery | undefined
    private maxResults: number | undefined
    private takeQuery: TakeQuery | undefined

    constructor() {
        this.sources = {
            "robert": "https://raw.githubusercontent.com/Soare-Robert-Daniel/otter-blocks-qa-templates/main/"
        }
        this.folder = "blocks"
        this.source = "robert"
    }

    select( folder: string ) {
        this.folder = folder;
        return this;
    }

    where( query: WhereQuery ) {
        this.query = query;
        return this;
    }

    from(source: string, url?: string) {
        this.source = source;
        if( url ) {
            this.sources[this.source] = url
        }
        return this;
    }

    take( maxResults: number, options: TakeQuery ) {
        this.maxResults = maxResults
        this.takeQuery = options
        return this;
    }

    async build() {
        if( this.source === undefined ) {
            console.warn("The source is undefined! Use '.from()' function to set a source.")
            return;
        }
        if( this.folder === undefined ) {
            console.warn("The folder is undefined! Use '.select()' function to set a folder.")
            return;
        }

        const mainPath = `${this.sources[this.source]}/${this.folder}`

        const respIndex = await fetch(`${mainPath}/index.json`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        if (!respIndex.ok) {
            console.warn('The repo does not exists!')
            return;
        }

        const index: FilesStructure = await respIndex.json();
        let validFiles = index?.files?.filter( file => {
            if( this.query === undefined ) {
                return true;
            }
            
            if( this.query?.names?.includes(file.name) ) {
                return true;
            }

            let valid = true;

            if( this.query.mode === undefined || this.query.mode === "exclusive" ) {
                if( Array.isArray( this.query?.has) ) {
                    valid = [...(file?.has?.blocks || []), ...(file?.has?.plugins || [])]?.every( blockSlug => (this.query?.has as string[])?.includes( blockSlug ))
                } else {
                    if( this.query?.has?.blocks !== undefined && file?.has?.blocks?.every( blockSlug => (this.query?.has as FileFeature)?.blocks?.includes(blockSlug)) ) {
                        valid = true;
                    }
                    if( this.query?.has?.plugins !== undefined && file?.has?.plugins?.every( pluginSlug => (this.query?.has as FileFeature)?.plugins?.includes(pluginSlug)) ) {
                        valid = true;
                    }
                }
            } else {
                if( Array.isArray( this.query?.has) ) {
                    valid = [...(file?.has?.blocks || []), ...(file?.has?.plugins || [])]?.some( blockSlug => (this.query?.has as string[])?.includes( blockSlug ))
                } else {
                    if( this.query?.has?.blocks !== undefined && file?.has?.blocks?.some( blockSlug => (this.query?.has as FileFeature)?.blocks?.includes(blockSlug)) ) {
                        valid = true;
                    }
                    if( this.query?.has?.plugins !== undefined && file?.has?.plugins?.some( pluginSlug => (this.query?.has as FileFeature)?.plugins?.includes(pluginSlug)) ) {
                        valid = true;
                    }
                }
            }

            if( this.query?.tags ) {
                if( this.query.mode === undefined || this.query.mode === "exclusive" ) {
                    valid = valid && Boolean(file?.tags?.every( blockTag => this.query?.tags?.includes( blockTag )))
                } else {
                    valid = valid && Boolean(file?.tags?.some( blockTags => this.query?.tags?.includes( blockTags )))
                }
            }

            if( this.query?.version ) {
                valid = valid && satisfies( file.version, this.query.version ) 
            }

            return valid;
        });

        if( this.takeQuery?.shuffle ) {
            validFiles = validFiles
                ?.map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
        }

        if( this.maxResults ) {
            validFiles = validFiles?.slice(0, this.maxResults)
        }

        return {
            files: validFiles,
            urls: validFiles?.map(({ name }) => `${mainPath}/${name}.json`)
        }
    }

    async run() {
        const { urls, files } = (await this.build()) || { urls: [] as string[]};

        console.groupCollapsed(`Fetching ${urls?.length} files!`)
        console.table( files.map(({ name }) => name))
        console.groupEnd()

        urls?.forEach( url => {
            try {
                setTimeout(() => {
                    fetch(url, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    })
                        .then((res) => {
                            if (res.ok) return res.json();
                            else throw new Error("Status code error: " + res.status)
                        })
                        .then(data => {
                            if( window.wp ) {
                                const block = wp?.blocks?.parse(data?.content)
                                if (block) {
                                    wp?.data?.dispatch('core/block-editor')?.insertBlocks(block)
                                } else {
                                    console.warn('Invalid block: ' + url)
                                }
                            } else {
                                console.log('File loaded: ' + url)
                            }
                        })
                }, Math.floor(Math.random() * 10) * 10);
            } catch (e) {
                console.error(e)
            }
        })

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

declare global {
    let wp: any;
    interface Window {
        wp: any
    }
}
export default QueryQA;
