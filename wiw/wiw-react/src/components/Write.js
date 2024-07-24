import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../assets/styles/WriteEdit.css";
import axios from "axios";

const IMAGES = {
  LOGO: "images/top-logo-1px.png",
  MENU_BTN: "images/menu_active_btn.png",
  LOGIN_BTN: "images/loginbtn.png",
  CLOSE_BTN: "images/close-btn.png",
  SEARCH_BTN: "images/search-btn.png",
};

function Write({ setWrite }) {
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length + selectedFiles.length > 3) {
      alert("최대 3장까지 업로드 가능합니다.");
      setSelectedFiles([]);
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

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag === "") return;
    if (hashtags.length >= 5) {
      alert("해시태그는 최대 5개까지 추가할 수 있습니다.");
      return;
    }
    if (trimmedTag.length > 12) {
      alert("해시태그는 최대 12자까지 가능합니다.");
      return;
    }
    setHashtags((prevTags) => [...prevTags, `${trimmedTag}`]);
    setNewTag("");
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
      formData.append("images", file);
    });

    const pureTextTags = hashtags.map((tag) => tag.replace(/^#/, ""));
    formData.append("hashtags", JSON.stringify(pureTextTags));
    formData.append("userInfo", JSON.stringify(loginUserInfo.username));

    try {
      if (loginUserInfo.username == null) {
        alert("로그인이 풀렸습니다. 다시 로그인해주세요!");
      }
      const response = await axios.post("/addPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("업로드 성공!");
      setWrite(false);
      setSelectedFiles([]);
      setContent("");
      setHashtags([]);
      setNewTag("");
    } catch (error) {
      console.error("포스팅 실패", error.response.data);
    }
  };

  const handleTagChange = (e) => {
    setNewTag(e.target.value);
  };

  return (
    <div className="write-edit-modal">
      <p
        className="w-e-close-btn"
        onClick={() => {
          setWrite(false);
        }}
      >
        <img src={IMAGES.CLOSE_BTN} alt="사이드 메뉴 닫기 버튼" />
      </p>
      <form className="img-upload-form" onSubmit={handleSubmit}>
        <div className="preview-box">
          {selectedFiles.length === 0 ? (
            <div className="no-images-msg">
              <p>
                선택된 이미지가 없습니다.
                <br />
                이미지는 최소 1장, 최대 3장까지 선택 가능합니다.
              </p>
            </div>
          ) : (
            selectedFiles.map((file, index) => (
              <div key={index} className="image-preview">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`미리보기 ${index}`}
                  className="preview-img"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImg(index)}
                  className="remove-btn"
                >
                  remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="tag-container">
          {hashtags.map((tag, index) => (
            <div key={index} className="tag-item">
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="remove-tag-btn"
              >
                x
              </button>
            </div>
          ))}
        </div>
        <input
          className="img-input"
          type="file"
          accept="image/*"
          id="img-file-seletor"
          multiple
          onChange={handleFileChange}
          required
        />
        <div className="new-tag-container">
          <input
            className="input-hashtag"
            type="text"
            value={newTag}
            onChange={handleTagChange}
            placeholder="해시태그를 입력하세요"
          />
          <button type="button" onClick={handleAddTag}>
            추가
          </button>
        </div>

        <button className="send-btn" type="submit">
          포스팅
        </button>
      </form>
    </div>
  );
}

export default Write;
