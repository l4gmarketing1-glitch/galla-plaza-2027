/** Resolve public media for either a custom domain or a GitHub project subpath. */
export const asset=(path:string)=>`${import.meta.env.BASE_URL}${path.replace(/^\//,'')}`;
