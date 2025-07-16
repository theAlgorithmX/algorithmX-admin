import { Fragment } from "react";
import StoryForm from "./form";
import axiosHttp from "../../../../utils/httpConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";

const AddStory = () => {
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get("storyId");
  const navigate = useNavigate();
  const { layout } = useParams();

  const handleStorySubmit = async (data) => {
    // Handle media file upload
    let mediaFile;
    if (typeof data?.impact_story_media === "string") {
      mediaFile = data?.impact_story_media;
    } else {
      if (data.impact_story_media && data.impact_story_media.length > 0) {
        mediaFile = data.impact_story_media[0];
      }
    }

    try {
      let URL;
      if (storyId) {
        URL = `/impact-story/${storyId}`;
      } else {
        URL = "/impact-story/";
      }
      
      console.log(data, "data response");
      const formData = new FormData();
      
      formData.append("title", data.title);
      formData.append("tags", JSON.stringify(data.tags));

      if (mediaFile && typeof mediaFile !== "string") {
        formData.append("impact_story_media", mediaFile);
      }

      let result;
      if (storyId) {
        result = await axiosHttp.put(URL, formData);
      } else {
        result = await axiosHttp.post(URL, formData);
      }
      
      if (result.status === 201) {
        toast.success(result?.data?.message || "Impact story added successfully!");
      }
      if (result.status === 200) {
        toast.success(result?.data?.message || "Impact story updated successfully!");
      }
      navigate(`${process.env.PUBLIC_URL}/widgets/view-story/${layout}`);
    } catch (err) {
      let error;
      if (err?.response?.data?.message) {
        error = err?.response?.data?.message;
      } else {
        error = err?.response?.statusText;
      }
      toast.warning(error);
    }
  };

  return (
    <Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <StoryForm onSubmit={handleStorySubmit} storyId={storyId} />
    </Fragment>
  );
};

export default AddStory;
