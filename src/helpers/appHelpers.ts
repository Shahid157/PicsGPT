import {photoAIJobCreationStatus} from './../constants/photoAIConstants';
import {jobDetails} from '../interfaces/appCommonIternfaces';

export const getPhotoAIJobStatus = (job: jobDetails) => {
  if (job) {
    if (!job.files && job.status === photoAIJobCreationStatus.complete) return;
    else if (job.status) return job.status;
    else return photoAIJobCreationStatus.estimating;
  } else return photoAIJobCreationStatus.estimating;
};
