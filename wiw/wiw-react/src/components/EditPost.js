import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../assets/styles/Detail.css";
import "../assets/styles/WriteEdit.css";
import axios from "axios";

function EditPost({ setEditModal, post }) {
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    if (post) {
      setHashtags(post.hashtags || []);
      // post.images의 URL을 selectedFiles 상태로 초기화
      setSelectedFiles(post.images.map((image) => image.url));
    }
  }, [post]);

  const handleFileChange = (e) => {
    if (e.target.files.length + selectedFiles.length > 3) {
      alert("최대 3장까지 업로드 가능합니다.");
      return;
    }
    const imgFileArr = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...imgFileArr]);
  };

  const handleRemoveImg = (index) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...hashtags];
    updatedTags.splice(index, 1);
    setHashtags(updatedTags);
  };

  const validateHashtags = () => {
    if (hashtags.length > 5) {
      alert("해시태그는 최대 5개까지 가능합니다.");
      return false;
    }
    for (const tag of hashtags) {
      if (tag.length > 12) {
        alert("각 해시태그는 최대 12자까지 가능합니다.");
        return false;
      }
    }
    return true;
  };

  const handleTagChange = (e) => {
    setNewTag(e.target.value);
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag === "") return;
    if (hashtags.length >= 5) {
      alert("해시태그는 최대 5개까지 추가할 수 있습니다.");
      return;
    }
    setHashtags((prevTags) => [...prevTags, `#${trimmedTag}`]);
    setNewTag("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("최소 한 장의 이미지를 업로드해야 합니다.");
      return;
    }

    if (!validateHashtags()) {
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      if (typeof file === "string") {
        formData.append("existingImages", file);
      } else {
        formData.append("images", file);
      }
    });

    const pureTextTags = hashtags.map((tag) => tag.replace(/^#/, ""));
    formData.append("hashtags", JSON.stringify(pureTextTags));
    formData.append("userInfo", JSON.stringify(loginUserInfo.username));
    formData.append("postId", post._id);

    try {
      const response = await axios.post("/editPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPostData(response.data.post);
      alert("수정하기 성공!");
      setEditModal(false);
    } catch (error) {
      console.error("포스팅 실패", error.response.data);
    }
  };

  return (
    <div className="red">
      <p
        className="close-btn"
        onClick={() => {
          setEditModal(false);
        }}
      >
        <img src="/images/close-btn.png" alt="모달창 닫기 버튼" />
      </p>
      <form className="img-upload-form" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <div className="preview-box">
          {selectedFiles.map((file, index) => (
            <div key={index} className="image-preview">
              <img
                src={
                  typeof file === "string" ? file : URL.createObjectURL(file)
                }
                alt={`미리보기 ${index}`}
                className="preview-img"
              />
              <button
                type="button"
                onClick={() => handleRemoveImg(index)}
                className="remove-btn"
              >
                제거
              </button>
            </div>
          ))}
        </div>

        <div className="tag-container">
          {hashtags.map((tag, index) => (
            <div key={index} className="tag-item">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="remove-tag-btn"
              >
                x
              </button>
            </div>
          ))}
          <div className="new-tag-container">
            <input
              type="text"
              value={newTag}
              onChange={handleTagChange}
              placeholder="#해시태그"
            />
            <button type="button" onClick={handleAddTag}>
              추가
            </button>
          </div>
        </div>

        <button type="submit">포스팅</button>
      </form>
    </div>
  );
}

export default EditPost;
