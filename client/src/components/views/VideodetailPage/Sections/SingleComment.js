import React, {useState} from 'react'
import { Comment, Avatar, Button, Input} from 'antd'
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';
import {useSelector} from 'react-redux'


const { TextArea } = Input;

function SingleComment(props) {

   
  const user = useSelector(state => state.user);
  const [OpenReply, setOpenReply] = useState(false)
  const [CommentValue, setCommentValue] = useState("")
  

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply)
  }

  const onHandleChange = (event) => {
    setCommentValue(event.currentTarget.value)
  }

  const onSubmit = (event) => {
    event.preventDefult();

    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo : props.comment._id
    }

    Axios.post('/api/comment/saveComment',variables)
    .then(response => {
      if(response.data.success){
        console.log(variables)
        setCommentValue("")
        setOpenReply(false)
        props.refreshFunction(response.data.result);
        console.log(response.data.result)
      } else  {
        alert('댓글 작성을 실패하였습니다.')

      }
    })

  }

  const actions = [
    <LikeDislikes userId={localStorage.getItem('userId')} commentId ={props.comment._id}/>
    //<span onClick={onClickReplyOpen} key = "comment-basic-reply-to">답글달기</span>
  ]
  return (
    
    <div>
      {<Comment
          actions={actions}
          author={props.comment.writer.name}
          avatar={<Avatar src={props.comment.writer.image} alt="avatar" />}
          content={ <p>{props.comment.content}</p>}
      />}
      

      {OpenReply &&
              <form style={{ display: 'flex'}} onSubmit={onSubmit}>
              <textarea
                style={{width: '100%', borderRadius: '5px'}}
                onChange={onHandleChange}
                value={CommentValue}
                placeholder='댓글 추가...'
            />
            <br />
            <button style={{width : '20%', height: '52px'}} onClick={onSubmit}>Submit</button>
            </form>
      }
    </div>
  )
}

export default SingleComment