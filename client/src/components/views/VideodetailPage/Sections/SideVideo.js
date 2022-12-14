import React, {useEffect, useState} from "react";
import Axios from "axios";

function SideVideo() {

  const [SideVideos, setSideVideos] = useState([])

  useEffect(() => {

    Axios.get('/api/video/getVideos')
    .then(response => {
      if(response.data.success) {
        console.log(response.data)
        setSideVideos(response.data.videos)
      } else {
        alert('비디오 가져오기를 실패했습니다.')
      }
    })
  },[])

  const renderSideVideo = SideVideos.map((video, index)=> {
    
    if(video.duration == ""){
      minutes = ""
      seconds = ""
    } else {
    var minutes = Math.floor(video.duration / 60);
    var seconds = `: ${Math.floor((video.duration - minutes * 60))}`
    }

    return     <div key={index} style={{display: 'flex', marginBottom: '1rem', padding: '0 2rem'}}>
    <div style={{width: '40%', marginRight: '1rem'}}>
      <a href={`/video/${video._id}`} style={{ color:'gray' }}>
        <img style={{width: '144px', height: "108px"}} src={`http://3.38.92.249:5000/${video.thumbnail}`} alt="thumbnail" />
      </a>
    </div>
  <div style={{width : '50%'}}>
    <a  href={`/video/${video._id}`} style={{color : 'gray'}}>
      <span style={{marginLeft : '0.4rem',fontSize : '1rem', color: 'black'}}> {video.title}</span><br />
      </a>
      <div style={{marginLeft : '0.4rem',color: 'gray'}}>
      <span>{video.writer.name}</span><br />

      <span>{minutes}  {seconds}</span>
      </div>
  </div>
  </div>
  })
  
  return (

    <React.Fragment>
      <div style={{marginTop: '3rem'}}/>
      {renderSideVideo}

    </React.Fragment>    


  )
}

export default SideVideo