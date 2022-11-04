import Axios from "axios";
import React, {useState, useEffect} from "react";

function Subscribe(props) {

  const [SubscribeNumber, setSubscribeNumber] = useState(0)
  const [Subscribed, setSubscribed] = useState(false)

  useEffect(() => {

    let variable = { userTo: props.userTo }

    Axios.post('/api/subscribe/SubscribeNumber', variable )
      .then( response => {
        if(response.data.success) {
            setSubscribeNumber(response.data.subscribeNumber)
        } else {
          alert('구독자 수를 받아오지 못 하였습니다.')
        }
      })

      let subscribedVariable = { userTo: props.userTo, userFrom : localStorage.getItem('userId') }

      Axios.post('/api/subscribe/subscribed', subscribedVariable )
        .then(response => {
          if(response.data.success){
              setSubscribed(response.data.subscribed)
          } else {
              alert('정보를 받아오지 못 했습니다.')
          }
        })
  }, [])

  const onSubscribe = () => {

    let subscribedvariable = {
      userTo : props.userTo,
      userFrom : props.userFrom
    }
    //이미 구독중인 상태
    if(Subscribed){

      Axios.post('/api/subscribe/unSubscribe', subscribedvariable)
        .then(response => {
          if(response.data.success) {
              setSubscribeNumber(SubscribeNumber - 1)
              setSubscribed(!Subscribed)
          } else {
            alert('구독 취소하는데 실패했습니다.')
          }
        })
    // 아직 구독중인 상태  
    } else {

      Axios.post('/api/subscribe/subscribe', subscribedvariable)
      .then(response => {
        if(response.data.success) {
          setSubscribeNumber(SubscribeNumber + 1)
          setSubscribed(!Subscribed)

        } else {
          alert('구독하는데 실패했습니다.')
        }
      })

    }
  }
  
  return (
    <div>
      <button
        style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px', border : '0',
                color: 'white', padding : '10px 16px',
                fontWeight: '500', fontSize: '1rem', textTransform: "uppercase"
              }}
              onClick={onSubscribe}
      >
          {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  )
}

export default Subscribe