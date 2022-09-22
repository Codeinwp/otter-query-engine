import {
    existsCondition,
    hasCondition,
    hasName,
    hasTags,
    hasVersion,
    WhereOptionalCondition,
    WhereCondition
} from "./conditions";

const VERSION = '0.1.1'

export type FileFeature = {
    blocks?: string[],
    plugins?: string[]
}

export type WhereQuery = {
    names?: string[],
    has?: string[] | FileFeature,
    mode?: "all" | "exclusive",
    tags?: string[]
    version?: string
}

export type TakeQuery = {
    shuffle?: boolean,
}

export type FileStructure = {
    name: string,
    has: FileFeature,
    tags?: string[]
    comment?: string
    version?: string
}

export type FilesStructure = {
    files?: FileStructure[]
}

class QueryQA {
    private readonly sources: { [key: string]: string };
    private source: string;
    private folder: string;
    private query: WhereQuery | undefined
    private maxResults: number | undefined
    private takeQuery: TakeQuery | undefined
    private whereConditions: WhereCondition[]
    private whereOptionalConditions: WhereOptionalCondition[]

    constructor() {
        this.sources = {
            "otter": "https://raw.githubusercontent.com/Codeinwp/otter-blocks-qa-templates/main/",
            "robert": "https://raw.githubusercontent.com/Soare-Robert-Daniel/otter-blocks-qa-templates/main/",
            "offline": "http://localhost:8085/"
        }
        this.folder = "blocks"
        this.source = "otter"

        this.whereConditions = [
            existsCondition,
            hasName,
            hasCondition
        ]

        this.whereOptionalConditions = [
            hasTags,
            hasVersion
        ]
    }

    select(folder: string) {
        this.folder = folder;
        return this;
    }

    where(query: WhereQuery) {
        this.query = query;
        return this;
    }

    from(source: string, url?: string) {
        this.source = source;
        if (url) {
            this.sources[this.source] = url
        }
        return this;
    }

    take(maxResults: number, options: TakeQuery) {
        this.maxResults = maxResults
        this.takeQuery = options
        return this;
    }

    async build() {
        if (this.source === undefined) {
            console.warn("The source is undefined! Use '.from()' function to set a source.")
            return;
        }
        if (this.folder === undefined) {
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

        let validFiles = index?.files
            ?.filter(file => this.whereConditions.some( cond => cond(this.query, file) ))
            ?.filter(file => {
                const x = this.whereOptionalConditions
                    .map(cond => cond(this.query, file))
                    .filter(c => c === 'unused');
                return x?.length > 0 ? x.some(c => c) : true;
            })

        if (this.takeQuery?.shuffle) {
            validFiles = validFiles
                ?.map(value => ({value, sort: Math.random()}))
                .sort((a, b) => a.sort - b.sort)
                .map(({value}) => value)
        }

        if (this.maxResults) {
            validFiles = validFiles?.slice(0, this.maxResults)
        }

        return {
            files: validFiles,
            urls: validFiles?.map(({name}) => `${mainPath}/${name}.json`)
        }
    }

    async test() {
        const {urls, files} = (await this.build()) || {urls: [] as string[]};

        console.groupCollapsed(`Fetching ${urls?.length} files!`)
        console.table(files.map(({name}) => name))
        console.groupEnd()

        urls?.forEach((url, i) => {
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
                            if( data ) {
                                console.log(`%c[Block ${i}] ${url}`, 'color: green;')
                            }
                        })
                }, Math.floor(Math.random() * 10) * 10);
            } catch (e) {
                console.error(e)
            }
        })
    }

    async run() {
        const {urls, files} = (await this.build()) || {urls: [] as string[]};

        console.groupCollapsed(`Fetching ${urls?.length} files!`)
        console.table(files.map(({name}) => name))
        console.groupEnd()

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
                            if (res.ok) return res.json();
                            else throw new Error("Status code error: " + res.status)
                        })
                        .then(data => {
                            if (window.wp) {
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

    createUI() {
        const settingsBar = document.querySelector("#editor div.edit-post-header__settings")
        if (!settingsBar) return;

        const btn = document.createElement('button')
        const hotBtn = document.createElement('button');
        const input = document.createElement('input')
        const docs = document.createElement('a')

        hotBtn.innerText = "Quick"
        hotBtn.style.marginRight = "5px"
        hotBtn.style.padding = "5px 10px"
        //hotBtn.style.color = "red"
        hotBtn.style.fontWeight = "700"
        hotBtn.onclick = () => {
            Function(input.value)();
            navigator.clipboard.readText().then(
                clipText => {
                    input.value = clipText;
                    Function(clipText)();
                });
        }
        settingsBar.insertBefore(hotBtn, settingsBar.firstChild)

        btn.innerText = "Run"
        btn.style.margin = "0px 5px"
        btn.style.padding = "5px 10px"
        btn.onclick = () => {
            Function(input.value)();
        }
        settingsBar.insertBefore(btn, settingsBar.firstChild)

        input.placeholder = `Paste the query. v${VERSION}`
        input.style.minWidth = "250px"
        input.style.padding = "5px";
        settingsBar.insertBefore(input, settingsBar.firstChild)

        docs.href = "https://github.com/Codeinwp/otter-query-engine/blob/master/README.md#usage"
        docs.target = "_blank"
        docs.innerHTML = `<svg width="24px" height="24px" style="position: absolute" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8,3 L8,17 L19,17 L19,3.5 C19,3.22385763 18.7761424,3 18.5,3 L8,3 Z M7,3 L6.5,3 C5.67157288,3 5,3.67157288 5,4.5 L5,17.4998169 C5.41783027,17.1859724 5.93719704,17 6.5,17 L7,17 L7,3 Z M4.15121433,20.3582581 C4.05793442,20.2674293 4,20.1404803 4,20 L4,4.5 C4,3.11928813 5.11928813,2 6.5,2 L18.5,2 C19.3284271,2 20,2.67157288 20,3.5 L20,20.5 C20,21.3284271 19.3284271,22 18.5,22 L6.5,22 C5.42082093,22 4.50134959,21.3162099 4.15121433,20.3582581 L4.15121433,20.3582581 Z M19,18 L6.5,18 C5.67157288,18 5,18.6715729 5,19.5 C5,20.3284271 5.67157288,21 6.5,21 L18.5,21 C18.7761424,21 19,20.7761424 19,20.5 L19,18 Z M10.5,10 C10.2238576,10 10,9.77614237 10,9.5 C10,9.22385763 10.2238576,9 10.5,9 L16.5,9 C16.7761424,9 17,9.22385763 17,9.5 C17,9.77614237 16.7761424,10 16.5,10 L10.5,10 Z M10.5,8 C10.2238576,8 10,7.77614237 10,7.5 C10,7.22385763 10.2238576,7 10.5,7 L14.5,7 C14.7761424,7 15,7.22385763 15,7.5 C15,7.77614237 14.7761424,8 14.5,8 L10.5,8 Z"/>
</svg>
`
        docs.style.display = "inline-flex"
        docs.style.alignItems = "center"
        docs.style.justifyContent = "center"
        docs.style.textDecoration = "none"
        docs.style.marginRight = "5px"
        docs.style.padding = "5px 10px"
        settingsBar.insertBefore(docs, settingsBar.firstChild)
    }
}

if (window || globalThis) {
    // @ts-ignore
    const global = window || globalThis;
    // @ts-ignore
    global.QueryQA = QueryQA;
    // @ts-ignore
    global.queryQA = new QueryQA();
    setTimeout(() => {
        new QueryQA().createUI();
    }, 1000)

}

declare global {
    let wp: any;

    interface Window {
        wp: any
    }
}
export default QueryQA;
