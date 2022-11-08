import React, { Component } from 'react';
import axios from 'axios';


class Weather extends Component {
    // 상태 변수 정의
    constructor(props) {
        super(props);
        this.state = { temp: 0, desc: '', icon: '', loading: true }
    }
    // 컴포넌트 생성 후 날씨 정보 조회
    componentDidMount() {
        const cityName = 'Seoul';
        const apiKey = '6cff56964271aba3611bafb4833ddb14';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=6cff56964271aba3611bafb4833ddb14`;

        // fetch() 함수를 이용
        // fetch(url)
        //     .then(response => response.json())
        //     .then(responseData => {
        //         this.setState({
        //             temp: responseData.main.temp,
        //             desc: responseData.weather[0].description,
        //             icon: responseData.weather[0].icon,
        //             loading: false
        //         });
        //     })
        //     .catch(error => console.log(error));

        // axios 라이브러리 이용
        axios.get(url)
            .then(responseData => {
                console.log(responseData);
                const data = responseData.data;
                this.setState({
                    temp: data.main.temp,
                    icon: data.weather[0].icon,
                    loading: false
                });
            })
            .catch(error => console.log(error));

    }
    // 날씨 정보 출력
    render() { 
        const imgSrc = `http://openweathermap.com/img/wn/${this.state.icon}.png`;
        if (this.state.loading) {
            return <p>Loading</p>;
        } else {
            return (
                <div className="App">
                  <a href='https://weather.naver.com/' target='_blank'><img src={imgSrc}/></a> 
                </div>
            );
        }
    }
}

export default Weather;