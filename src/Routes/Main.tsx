import { getNndm, getSeoulWeather, IStockProps, IWeatherProps } from "../api";
import {useQuery} from "react-query";
import styled from "styled-components";
import { useEffect, useState } from "react";
import {AnimatePresence, motion} from "framer-motion";
import { isAbsolute } from "node:path/win32";
const Container=styled.div<{day:string}>`
    background-image:${props=>`url("${process.env.PUBLIC_URL}images/${props.day}.jpg")`};
    width:100%;
    height:100vh;
    background-size:cover;
    background-position: center;
    position:relative;
    min-width:1000px;
`;
const Content=styled(motion.div)`
    width:50%;
    margin: 0 auto;
    position:relative;
    height:100vh;
    box-sizing: border-box;
    padding-top:300px;
`;
const Time=styled(motion.div)`
    font-size:150px;
    font-weight:bold;
    color:white;
    display:flex;
    position:relative;
    left:50%;
    transform:translateX(-50%);
    width:595px;
    opacity:0.6;
`;
const MoveTime=styled(motion.div)`
`;
const Search=styled(motion.div)`
    position:relative;
    width:400px;
    margin:0 auto;
    text-align:center;
    & > input{
        width:100%;
        height:50px;
        background-color:transparent;
        border:none;
        border-bottom:1px solid white;
        outline:none;
        color:white;
        font-size:20px;
        padding-left: 30px;
        transform: translateX(-15px);
    }
    & > svg{
            width:25px;
            fill:white;
            position:absolute;
            bottom:12px;
            left:-15px;
        }
`;
const Weather=styled(motion.div)`
    margin:0 auto;
    margin-top:30px;
    width:40%;
    min-width:300px;
    background:black;
    height:100px;
    border-radius:20px;
    display:flex;
    color:white;
    opacity:0.6;
`;
const WeatherIcon=styled.div`
    width:100px;
    height:100px;
    display:flex;
    justify-content: center;
    align-items:center;
    & > svg{
        width:80px;
        fill:white;
    }
`
const WeatherInfo=styled.div`
    display:flex;
    flex-direction: column;
    justify-content: center;
    & > :nth-child(2){
        font-size:20px;
        font-weight:bold;
    }
`;
const timeVariants={
    before:{
        y:50,opacity:0
    },
    after:{
        y:0,opacity:1
    },
    exit:{
        y:-50, opacity:0
    }
}
function Main(){
    const {data, isLoading}=useQuery<IStockProps>("nndm", getNndm);
    const {data:weather, isLoading:weatherLoading}=useQuery<IWeatherProps>("weather", getSeoulWeather);
    const [hours, setHours]=useState(["0", "0"]);
    const [minutes, setMinutes]=useState(["0","0"]);
    const [seconds, setSeconds]=useState(["0","0"]);
    const [day, setDay]=useState("night");
    console.log(weather?.weather[0].main);
    useEffect(()=>{
        setTimeout(()=>{
            const time=new Date();
            let hour=String(time.getHours());
            let minute=String(time.getMinutes());
            let second=String(time.getSeconds());
            if(hour.length==1)
                hour="0"+hour;
            if(minute.length==1)
                minute="0"+minute;
            if(second.length==1)
                second="0"+second;
            if(Number(hour)>=19||Number(hour)<=6)
                setDay("night");
            else
                setDay("sunny");
            setHours([hour.substring(0,1),hour.substring(1,2)])
            setMinutes([minute.substring(0,1),minute.substring(1,2)])
            setSeconds([second.substring(0,1),second.substring(1,2)])
        },1000);
    },[seconds])
    return (
        <Container day={day}>
            <Content>
                <Time whileHover={{opacity:1}}>
                    <AnimatePresence initial={false} >
                        <MoveTime  transition={{type:"linear"}}  variants={timeVariants} initial="before" animate="after"  key={"h0"+hours[0]}>{hours[0]}</MoveTime>
                        <MoveTime  transition={{type:"linear"}}  variants={timeVariants} initial="before" animate="after"  key={"h1"+hours[1]}>{hours[1]}</MoveTime>
                        <span key="1:">:</span>
                        <MoveTime  transition={{type:"linear"}}  variants={timeVariants} initial="before" animate="after"  key={"m0"+minutes[0]}>{minutes[0]}</MoveTime>
                        <MoveTime  transition={{type:"linear"}}  variants={timeVariants} initial="before" animate="after"  key={"m1"+minutes[1]}>{minutes[1]}</MoveTime>
                        <span key="2:">:</span>
                        <MoveTime  transition={{type:"linear"}}  variants={timeVariants} initial="before" animate="after"  key={"s0"+seconds[0]}>{seconds[0]}</MoveTime>
                        <MoveTime  transition={{type:"linear"}}  variants={timeVariants} initial="before" animate="after"  key={"s1"+seconds[1]}>{seconds[1]}</MoveTime>
                    </AnimatePresence>
                </Time>
                <Search>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/></svg>
                    <motion.input  type="text" />
                </Search>
                <Weather whileHover={{opacity:1}}>
                    <WeatherIcon>
                       {weather?.weather[0].main=="Clouds"?(
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96.2 200.1C96.07 197.4 96 194.7 96 192C96 103.6 167.6 32 256 32C315.3 32 367 64.25 394.7 112.2C409.9 101.1 428.3 96 448 96C501 96 544 138.1 544 192C544 204.2 541.7 215.8 537.6 226.6C596 238.4 640 290.1 640 352C640 422.7 582.7 480 512 480H144C64.47 480 0 415.5 0 336C0 273.2 40.17 219.8 96.2 200.1z"/></svg>
                       ):weather?.weather[0].main=="Clear"?(
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 159.1c-53.02 0-95.1 42.98-95.1 95.1S202.1 351.1 256 351.1s95.1-42.98 95.1-95.1S309 159.1 256 159.1zM509.3 347L446.1 255.1l63.15-91.01c6.332-9.125 1.104-21.74-9.826-23.72l-109-19.7l-19.7-109c-1.975-10.93-14.59-16.16-23.72-9.824L256 65.89L164.1 2.736c-9.125-6.332-21.74-1.107-23.72 9.824L121.6 121.6L12.56 141.3C1.633 143.2-3.596 155.9 2.736 164.1L65.89 256l-63.15 91.01c-6.332 9.125-1.105 21.74 9.824 23.72l109 19.7l19.7 109c1.975 10.93 14.59 16.16 23.72 9.824L256 446.1l91.01 63.15c9.127 6.334 21.75 1.107 23.72-9.822l19.7-109l109-19.7C510.4 368.8 515.6 356.1 509.3 347zM256 383.1c-70.69 0-127.1-57.31-127.1-127.1c0-70.69 57.31-127.1 127.1-127.1s127.1 57.3 127.1 127.1C383.1 326.7 326.7 383.1 256 383.1z"/></svg>
                       ):weather?.weather[0].main=="Rain"?(
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 128c-.625 0-1.125 .25-1.625 .25C415.5 123 416 117.6 416 112C416 67.75 380.3 32 336 32c-24.62 0-46.25 11.25-61 28.75C256.4 24.75 219.3 0 176 0C114.1 0 64 50.13 64 112c0 7.25 .75 14.25 2.125 21.25C27.75 145.8 0 181.5 0 224c0 53 43 96 96 96h320c53 0 96-43 96-96S469 128 416 128zM368 464c0 26.51 21.49 48 48 48s48-21.49 48-48s-48.01-95.1-48.01-95.1S368 437.5 368 464zM48 464C48 490.5 69.49 512 96 512s48-21.49 48-48s-48.01-95.1-48.01-95.1S48 437.5 48 464zM208 464c0 26.51 21.49 48 48 48s48-21.49 48-48s-48.01-95.1-48.01-95.1S208 437.5 208 464z"/></svg>
                       ):null} 
                    </WeatherIcon>
                    <WeatherInfo>
                        <span>{weather?.name}/{weather?.weather[0].main}</span>
                        <span>{weather?.main.temp?(weather.main.temp-273).toFixed(2):null}℃</span>
                        <span>{weather?.main.temp_min?(weather.main.temp_min-273).toFixed(2):null}/{weather?.main.temp_max?(weather.main.temp_max-273).toFixed(2):null}℃</span>
                    </WeatherInfo>
                </Weather>
            </Content>
        </Container>
    )
}
export default Main;