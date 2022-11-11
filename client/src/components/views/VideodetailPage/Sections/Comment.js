import Axios from 'axios'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'

function Comment(props) {

  const videoId = props.postId;

  const user = useSelector(state => state.user);
  
  const [commentValue, setcommentValue] = useState("")

  const handleClick = (event) => {
    setcommentValue(event.currentTarget.value)
  }

  const onSubmit = (event) => {
    event.preventDefault();


    let variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId
    }


    Axios.post('/api/comment/saveComment',variables)
    .then(response => {
      if(response.data.success){
        setcommentValue("")
        props.refreshFunction(response.data.result);
      } else {
        alert('댓글 작성을 실패하였습니다.')
      }
    })
  }
  if (user.userData && !user.userData.isAuth){
  return (
    <div>
      <br />
      <p> 댓글</p>
      <hr />

      {/* Comment Lists */}

      {props.commentLists && props.commentLists.map((comment, index) => (
        (!comment.responseTo &&
        <React.Fragment key={index}>
          <SingleComment refreshFunction={props.refreshFunction}  comment={comment} postId={props.videoId} />
          <ReplyComment   refreshFunction={props.refreshFunction}  parentCommentId={comment._id}
                           postId={props.videoId} commentLists={props.commentLists} />
        </React.Fragment>  
      )))}
    </div>
  )
} else {
  return (
    <div>
      <br />
      <p> 댓글</p>
      <hr />

      {/* Comment Lists */}

      {props.commentLists && props.commentLists.map((comment, index) => (
        (!comment.responseTo &&
        <React.Fragment key={index}>
          <SingleComment refreshFunction={props.refreshFunction}  comment={comment} postId={props.videoId} />
          <ReplyComment   refreshFunction={props.refreshFunction}  parentCommentId={comment._id}
                           postId={props.videoId} commentLists={props.commentLists} />
        </React.Fragment>  
      )))}


      {/* Root Comment Form */}
      <form style={{ display: 'flex'}} onSubmit={onSubmit}>
        <textarea
          style={{width: '100%', borderRadius: '5px'}}
          onChange={handleClick}
          value={commentValue}
          placeholder='댓글 추가...'
      />
      <br />
      <button style={{width : '20%', height: '52px'}} onClick={onSubmit}>Submit</button>
      </form>
    </div>
  )
}}
export default Comment