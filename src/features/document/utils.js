export const getLinkInfo = (link, part) => {
  if (!link) return null;

  const url = new URL(link);
  return `${url.pathname.split("/")[part]}`;
};

export const getEndpointInfo = (entityType) => {
  switch (entityType) {
    case "Document":
      return "documents";
    case "Folder":
      return "folders";
    default:
      return "files";
  }
};
