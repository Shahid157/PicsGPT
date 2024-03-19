import {jobStatus} from './../constants/appConstants';
import {jobInterface} from './../interfaces/appCommonIternfaces';

export const convertPlaneArrayWithCategoryObject = (data: any[]) => {
  const groupedData = data?.reduce((acc?: any, item?: any) => {
    if (!acc[item?.prompt_category]) {
      acc[item?.prompt_category] = [];
    }
    acc[item?.prompt_category].push(item);
    return acc;
  }, {});

  const formattedData = Object.keys(groupedData).map((category, index) => ({
    indexId: index,
    type: category,
    data: groupedData[category],
  }));
  const res = Object.values(formattedData);
  return res || [];
};

export const getStyleByID = (style_id: string, data: any[]) => {
  let index = data.findIndex(style => style.style_id === style_id);
  return index === -1 ? {} : data[index];
};

export const getInProgressJobs = (jobs: jobInterface[]) => {
  return jobs?.filter(
    (job: jobInterface) =>
      job.status === jobStatus.pending ||
      job.status === jobStatus.docker_pulling ||
      job.status === jobStatus.training ||
      job.status === jobStatus.running ||
      job.status === null,
  );
};
