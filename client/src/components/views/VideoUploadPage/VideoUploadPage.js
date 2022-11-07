import React, {useState} from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const Title  = Typography;

const PrivateOptions = [
  {value : 0, label: "표준"},
  {value : 1, label : "통통"},
  {value : 2, label : "마름"}
]

const CategoryOptions = [
  {value : 0, label: "180CM⬆"},
  {value : 1, label: "170CM~180CM"},
  {value : 2, label: "160CM~170CM"},
  {value : 3, label: "150CM~160CM"},
  {value : 4, label: "150CM⬇"}
]

function VideoUploadPage(props) {

const user = useSelector(state => state.user);
const [VideoTitle, setVideoTitle] = useState("")
const [Description, setDescription] = useState("")
const [Private, setPrivate] = useState("표준")
const [Category, setCategory] = useState("180CM⬆")
const [FilePath, setFilePath] = useState("")
const [Duration, setfDuration] = useState("")
const [ThumbnailPath,setThumbnailPath ] = useState("") 

const onTitleChange = (e) => {
  setVideoTitle(e.currentTarget.value)
}


const onDescriptionChange = (e) => {
  setDescription(e.currentTarget.value)
}

const onPrivateChange = (e) => {
  setPrivate(e.currentTarget.value)
}

const onCategoryChange = (e) => {
  setCategory(e.currentTarget.value)
}

const onDrop = (files) => { //파일정보가 담겨있음

  let formData = new FormData;
  const config = {
    header: {'content-type' : 'multipart/form-data'}
  }
  formData.append("file", files[0])

  Axios.post('/api/video/uploadfiles', formData, config)
  .then(response => {
    if(response.data.success) {
      console.log(response.data)
      let variable = {
        url: response.data.url,
        fileName: response.data.fileName
      }
      
      setFilePath(response.data.url)

      Axios.post('/api/video/thumbnail', variable)
      .then(response => {
        if(response.data.success) {
          console.log(response.data)
          
          setfDuration(response.data.fileDuration)
          setThumbnailPath(response.data.url)

        } else {
          alert('썸네일 생성에 실패했습니다.')
        }
      })
    } else {
      alert('업로드에 실패하였습니다. MP4만 업로드가 가능합니다.')
    }
  })
}

const onDropImage = (files) => { //파일정보가 담겨있음

  let formData = new FormData;
  const config = {
    header: {'content-type' : 'multipart/form-data'}
  }
  formData.append("file", files[0])

  Axios.post('/api/video/uploadfilesImage', formData, config)
  .then(response => {
    if(response.data.success) {

      let variable = {
        url: response.data.url,
        fileName: response.data.fileName,
        thumbnail : FilePath
      }

      setFilePath(response.data.url)

      Axios.post('/api/video/thumbnail', variable)
      .then(response => {
        if(response.data.success) {
          
          setThumbnailPath(response.data.url)

        } else {
          alert('썸네일 생성에 실패했습니다.')
        }
      })
    } else {
      alert('업로드에 실패하였습니다. JPG, JPEG, PNG만 업로드가 가능합니다.')
    }
  })
}


const onSubmit = (e) => {
  e.preventDefault();
  
  let variable = {
    writer: user.userData._id,
    title: VideoTitle,
    description : Description,
    privacy : Private,
    filePath : FilePath,
    category : Category,
    duration : Duration,
    thumbnail: ThumbnailPath
  }

  Axios.post('/api/video/uploadVideo', variable)
  .then(response => {
    console.log(response)
    
    if(response.data.success) {
      
      message.success('비디오 업로드에 성공했습니다')
      setTimeout(() => {
      props.history.push('/')
      },1800);

    } else {
      alert('비디오 업로드에 실패하였습니다.')
    }
  })
}

    return (
        <div
            style={{
                maxWidth: '700px',
                margin: '2rem auto'
            }}>
            <div
                style={{
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit={onSubmit}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                    {/*사진 올리는곳*/}

                    <Dropzone
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={800000000}
                    >
                      {({ getRootProps, getInputProps}) => (
                      <div style={{ width: '200px', height : '240px', border: '1px solid lightgray', display: 'flex',
                      alignItems: 'center', justifyContent:'center'}} {...getRootProps()}>
                        <input {...getInputProps()} />
                       영상 추가
                      </div>
                    )}

                    </Dropzone>

                    <Dropzone
                    onDrop={onDropImage}
                    multiple={false}
                    maxSize={800000000}
                    >
                      {({ getRootProps, getInputProps}) => (
                      <div id='imgae' style={{ width: '200px', height : '240px', border: '1px solid lightgray', display: 'flex',
                      alignItems: 'center', justifyContent:'center'}} {...getRootProps()}>
                        <input {...getInputProps()} />
                       사진 추가
                      </div>
                    )}

                    </Dropzone>
                    {/*썸네일*/}

                    {ThumbnailPath &&
                      <div >
                          <img style = {{width : "320px",height : "240px"}} src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                      </div>
                    }

                </div>
                <br/>
                <br/>
                <label>타이틀</label>
                <Input onChange={onTitleChange} value={VideoTitle} />
                <br/>
                <br/>
                <label>설명</label>
                <TextArea onChange={onDescriptionChange} value={Description} />
                <br/>
                <br/>

                <select onChange={onPrivateChange}>
                  {PrivateOptions.map((item, index)=> (
                    <option key={index} value={item.label}>{item.label}</option>
                  ))}
                </select>
                <br/>
                <br/>
                <select onChange={onCategoryChange}>
                  {CategoryOptions.map((item, index)=> (
                      <option key={index} value={item.label}>{item.label}</option>
                    ))}
                </select>
                <br/>
                <br/>

                <Button type='primary' size='large' onClick={onSubmit}>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage