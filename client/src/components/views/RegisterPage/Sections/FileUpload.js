import React, { useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { Formik } from 'formik';
import * as Yup from 'yup';

//=================================
//       File-Upload
//=================================

const FileUpload = (props) => {
  //=================================
  //     State-Hook
  const [previewImg, setPreviewImg] = useState([]);
  //=================================



  const handleFileOnChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    // console.log(file, reader);
    reader.onloadend = () => {
      setPreviewImg({
        file: file,
        previewURL: reader.result,
      });
    };
    reader.readAsDataURL(file);

    // Post-API
    const formData = new FormData();
    formData.append('profile_img', event.target.files[0]);
    Axios.post('/api/image', formData, {
      header: { 'content-type': 'multipart/form-data' },
    }).then((response) => {
      console.log(response.data.image);
      props.fileToParents(response.data.image);
    });
  };

  //=================================
  // Conditional-Rendering-Component
  let profile_preview = null;
  if (previewImg !== '') {
    profile_preview = (
      <div>
        <img
          className="profile_preview"
          src={previewImg.previewURL}
          style={{ height: '140px' }}
          alt=""
        ></img>
      </div>
    );
  }
  //=================================
  return (

    <>
      <form encType="multipart/form-data" style={{ display: 'flex', marginLeft: '0.7rem' }}>
        <FakeUploadBtn>{profile_preview}</FakeUploadBtn>
        <UploadButton
          id='image'
          type="file"
          accept="image/jpg,impge/png,image/jpeg"
          name="profile_img"
          placeholder="업로드"
          onChange={handleFileOnChange}
        ></UploadButton>
      </form>
    </>
  );

};

//=================================
//       Styled-Component
//=================================

const FakeUploadBtn = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
  width: 150px;
  height: 120px;
  justify-content: center;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-image: url('http://3.38.92.249:5000/uploads/icon/profile.png');
  background-repeat : no-repeat;
  background-size : cover;
`;

const UploadButton = styled.input`
  position: relative;
  margin-right: 1px;
  width: 9vw;
  right: 11vw;
  opacity: 0;
`;

export default FileUpload