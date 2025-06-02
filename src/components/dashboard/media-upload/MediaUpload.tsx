
import React from "react";
import EnhancedMediaUpload from "../post-creation/EnhancedMediaUpload";
import { MediaUploadProps } from "./MediaUploadTypes";

const MediaUpload = (props: MediaUploadProps) => {
  return <EnhancedMediaUpload {...props} />;
};

export default MediaUpload;
