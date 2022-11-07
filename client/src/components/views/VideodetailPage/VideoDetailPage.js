import React, {useEffect, useState } from 'react'
import { Row, Col, List, Input, Avatar} from 'antd'
import Axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comment from './Sections/Comment'
import LikeDislikes from './Sections/LikeDislikes'


function VideoDetailPage(props) {

  

  const videoId = props.match.params.videoId
  const variable = {videoId: videoId}

  const [VideoDetail, setVideoDetail] = useState([])
  const [Comments, setComments] = useState([])
  

  useEffect(() => {
     Axios.post('/api/video/getVideoDetail', variable)
      .then(response => {
        if(response.data.success) {
          setVideoDetail(response.data.videoDetail)
        } else {
          alert('비디오불러오기에 실패하였습니다.')
        }
      })

      Axios.post('/api/comment/getComments', variable)
      .then(response => {
          if (response.data.success) {
              setComments(response.data.comments)

              console.log(response.data.comments)
          }else {
              alert('코멘트 정보를 가져오는 것을 실패했습니다.');
          }
      });

}, []);

const refreshFunction = (newComment) => {
  setComments(Comments.concat(newComment))
}
  
  if(VideoDetail.writer && VideoDetail.duration != "")  {
    console.log(VideoDetail)
    const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId')
     && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />

  return (

    <Row gutter={[16, 16]}>
      <Col lg={18} xs={24}>
      <div style={{ width : '100%',height: '50%', padding : '3rem 4rem'}}>
        <video style={{width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />

        <List.Item
          actions={[<LikeDislikes   video userId={localStorage.getItem('userId')} videoId={videoId} />, subscribeButton]}
        >
        <List.Item.Meta style={{marginTop : "0rem"}}

        title={VideoDetail.writer.name}
        avatar={<Avatar src={VideoDetail.writer.image}/>}
        description={VideoDetail.description}
        />
      </List.Item>
      <List.Item>
      <List.Item.Meta style={{ color: "#363636" }}
        title={`키 : ${VideoDetail.category}`}
        description={`체형 : ${VideoDetail.privacy}`}
        />
      </List.Item>

      {/* Comments */}
      <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId} />

      </div>

      </Col>
      <Col lg={6} xs={24}>
        <SideVideo />
      </Col>
    </Row>
  )
} else if(VideoDetail.writer && VideoDetail.duration == "") {
  console.log(VideoDetail)
  const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') 
  && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />

  return (

  <Row gutter={[16, 16]}>
    <Col lg={18} xs={24}>
    <div style={{ width : '100%', padding : '3rem 4rem'}}>
    <img style={{width: '80%', paddingLeft: '15rem'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
      <List.Item
        actions={[<LikeDislikes   video userId={localStorage.getItem('userId')} videoId={videoId} />, subscribeButton]}
      >
      <List.Item.Meta style={{marginTop : "0rem"}}

      title={VideoDetail.writer.name}
      avatar={<Avatar src={VideoDetail.writer.image}/>}
      description={VideoDetail.description}
      />
    </List.Item>
    <List.Item>
    <List.Item.Meta style={{ color: "#363636" }}
      title={`키 : ${VideoDetail.category}`}
      description={`체형 : ${VideoDetail.privacy}`}
      />
    </List.Item>

    {/* Comments */}
    <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId} />

    </div>

    </Col>
    <Col lg={6} xs={24}>
      <SideVideo />
    </Col>
  </Row>
)
} else {
  return (
    <div>...로딩중</div>
  )
}

}

export default VideoDetailPage