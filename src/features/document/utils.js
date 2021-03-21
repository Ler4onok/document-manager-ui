export const getLinkInfo = (link, part) => {
  const url = new URL(link);
  return `${url.pathname.split("/")[part]}`;
};
