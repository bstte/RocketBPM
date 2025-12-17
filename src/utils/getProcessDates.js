import api from "../API/api";

export async function getProcessDates(processId, pageGroupId) {
      const publishedStatus = "Published";
     const draftStatus = "Draft";

  const [publishedRes, draftRes] = await Promise.all([
    api.GetPublishedDate(processId, publishedStatus, pageGroupId),
    api.GetPublishedDate(processId, draftStatus, pageGroupId),
  ]);

  return {
    publishedDate: publishedRes?.status ? publishedRes.updated_at : "",
    draftDate: draftRes?.status ? draftRes.updated_at : "",
  };
}
