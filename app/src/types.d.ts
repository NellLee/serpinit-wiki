declare type LinkObject = {
    href: string,
    text: string,
};

type NamedLinkList = {
    name: string;
    linkList: LinkObject[]
}