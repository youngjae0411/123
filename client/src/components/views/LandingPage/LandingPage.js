import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd';
import Axios from 'axios';

import moment from 'moment';
const { Title} = Typography
const {Meta} = Card;

function LandingPage() {

  const [Video, setVideo] = useState([]);

  useEffect(() => {

    Axios.get('/api/video/getVideos')
    .then(response => {
      if(response.data.success) {
        console.log(response.data)
        setVideo(response.data.videos)
      } else {
        alert('비디오 가져오기를 실패했습니다.')
      }
    })
  },[])

  const renderCards = Video.map((video, index) => {
    if(video.duration == ""){
      minutes = ""
      seconds = ""
    } else {
    var minutes = Math.floor(video.duration / 60);
    var seconds = `: ${Math.floor((video.duration - minutes * 60))}`
    }
    
    console.log(video)
    return  <Col key={index} lg={6} md={8} xs={24}>
      <div style={{ position: 'relative'}}>
      <a href={`/video/${video._id}`} >
      <img  style={{ width: '100%', height: "240px" }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
      <div className='duration'>
          <span>{minutes}  {seconds}</span>
        </div>
        </a> 
      </div> 
    <br />
    <Meta  
          avatar={
            <Avatar src={video.writer.image} />
          }
    title={video.title}  
    description="" />
    <span style={{}}>{video.writer.name}</span><br/>
    <span style={{ marginLeft: '3rem'}}></span><span> {moment(video.createdAt).format("MMM Do YY")} </span>
    </Col>

  })

    return (
      <div style={{ width: '85%', margin: '3rem auto'}}>
        <Title level={2}>Recommend</Title> 
        <hr />
        <Row gutter={[32, 16]}>
          {renderCards}
        </Row>
         
      </div>
    )
}

export default LandingPage
