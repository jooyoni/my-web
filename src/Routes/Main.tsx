import { getNndm, getSeoulWeather, IStockProps, IWeatherProps } from "../api";
import {useQuery} from "react-query";
import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import {AnimatePresence, motion} from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const Container=styled.div<{day:string}>`
    background-image:${props=>`url("${process.env.PUBLIC_URL}/images/${props.day}.jpg")`};
    width:100%;
    height:100vh;
    background-size:cover;
    background-position: center;
    position:relative;
    min-width:1000px;
    min-height:800px;
`;
const Content=styled(motion.div)`
    width:50%;
    margin: 0 auto;
    position:relative;
    height:100vh;
    box-sizing: border-box;
    padding-top:220px;
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
    & > form > input{
        width:100%;
        height:50px;
        background-color:transparent;
        border:none;
        border-bottom:1px solid white;
        outline:none;
        color:white;
        font-size:20px;
        padding-left: 30px;
        box-sizing: border-box;
        ::placeholder{
            color:white;
        }
        
    }
    & > form >  svg{
            width:25px;
            fill:white;
            position:absolute;
            bottom:12px;
        }

`;
const Weather=styled(motion.div)`
    margin:0 auto;
    margin-top:60px;
    width:385px;
    background:black;
    height:100px;
    border-radius:20px;
    display:flex;
    color:white;
    opacity:0.6;
`;
const WeatherIcon=styled.div`
    width:60px;
    height:60px;
    padding:0 10px;
    display:flex;
    justify-content: center;
    align-items:center;
    align-self:center;
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
const Stock=styled(motion.div)`
    box-sizing: border-box;
    width:385px;
    border-radius:20px;
    height:100px;
    margin: 0 auto;
    background-color:black;
    opacity:0.6;
    color:white;
    margin-top:20px;
    display:flex;
    justify-content: space-around;
    & > div:first-child{
        display:flex;
        flex-direction:column;
        justify-content: center;
        margin-right:15px;
        & > span:last-child{
            font-size:14px;
        }
    }
    & > div:last-child{
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
    }
`;
const PriceInfo=styled.div`
    & > :first-child {
        font-size:25px;
        font-weight:bold;
    }
    & > :last-child{
        font-size:15px;
    }
`;
const SideBar=styled.div`
    position:absolute;
    width:50px;
    height:100%;
    box-sizing: border-box;
    top:0;
    left:0;
`
const QuickIcons=styled(motion.div)`
    display:flex;
    flex-direction:column;
    position:absolute;
    left:0;
    top:30px;

    ul, li{
        margin:0;
        padding:0;
    }
    & > ul > li{
        border:1px solid #dfdfdf;
        border-radius:50%;
        background-color:white;
        width:50px;
        height:50px;
        display:flex;
        justify-content: center;
        align-items: center;
        margin-bottom:20px;
        box-shadow:0px 2px 3px 1px black;
        position:relative;
        &::after{
            display:block;
            content:"";
            width:60px;
            height:50px;
            position: absolute;
            top:0;
            right:0;
            transform:translateX(80%);
        }
        &:nth-child(1) > svg{
            width:32px;
        }
        &:nth-child(2) > svg{
            width:40px;
        }
        &:nth-child(3) > svg{
            width:35px;
            transform: translateX(-2px);
        }
        &:nth-child(4) > svg{
            width:26px;
        }
        &:nth-child(5) > svg{
            width:26px;
        }
    }
`;
const SecondUl=styled(motion.ul)`
    position:absolute;
    top:0;
    right:0;
    transform:translateX(110%);
    width:230px;
    border-radius:10px;
    overflow: hidden;
    z-index: 3;
    &, li{
        list-style:none;
        padding:0;
        margin:0;
    }
`;
const SecondLi=styled(motion.li)`
    width:100%;
    height:50px;

    & > a{    
        color:white;
        background-color: #303030;
        text-decoration: none;
        color:white;
        display:flex;
        justify-content: center;
        align-items: center;
        width:100%;
        height:100%;
        font-size:18px;
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
        y:10, opacity:0
    }
}

const secondVariants={

    end:{
        transition:{
            staggerChildren:0.2
        }
    }
}
const secondLiVariants={
    start:{
        y:50,
        opacity:0,
    },
    end:{
        y:0,
        opacity:1,
        transition:{
            duration:0.12
        }
    },
}
const childVariants={
    hover:{
        scale:1.05, 
        backgroundColor:"#dfdfdf",
        color:"black",
        transition:{
            duration:0.5
        }
    }
}


interface ISearchProps{
    search?:string;
}

function Main(){
    const {data, isLoading}=useQuery<IStockProps>("nndm", getNndm);
    const {data:weather, isLoading:weatherLoading}=useQuery<IWeatherProps>("weather", getSeoulWeather);
    const [hours, setHours]=useState(["0", "0"]);
    const [minutes, setMinutes]=useState(["0","0"]);
    const [seconds, setSeconds]=useState(["0","0"]);
    const [day, setDay]=useState("night");
    const [searchValue, setSearchValue]=useState("");
    const [sideBarMouseIn, setSideBarMouseIn]=useState(false);
    const [projectMouseIn, setProjectMouseIn]=useState(false);
    const [oneMouseIn, setOneMouseIn]=useState(false);
    const [twoMouseIn, setTwoMouseIn]=useState(false);
    const [threeMouseIn, setThreeMouseIn]=useState(false);
    const [fourMouseIn, setFourMouseIn]=useState(false);
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
            if(weather?.weather[0].main=="Rain")
                setDay("rain");
            else{
                if(Number(hour)>=19||Number(hour)<=6)
                setDay("night");
                else
                setDay("sunny");
            }
            setHours([hour.substring(0,1),hour.substring(1,2)])
            setMinutes([minute.substring(0,1),minute.substring(1,2)])
            setSeconds([second.substring(0,1),second.substring(1,2)])
        },1000);
    },[seconds]);
    const onSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        document.location.href=`https://www.google.com/search?q=${searchValue}&biw=1920&bih=937&sxsrf=APq-WBuqhF6sNnSbSzYZTHKxVtElesJW8g%3A1650267364919&ei=5BRdYpXZN6XH2roPoKqkqAI&ved=0ahUKEwiV28eAjZ33AhWlo1YBHSAVCSUQ4dUDCA4&uact=5&oq=form%ED%83%9C%EA%B7%B8&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEOgQIIxAnOggILhCABBCxAzoLCAAQgAQQsQMQgwE6CAgAEIAEELEDOgUILhCABDoHCCMQ6gIQJzoOCC4QgAQQsQMQxwEQ0QM6BwgAEIAEEAo6CAguEIAEENQCOg4ILhCABBCxAxDHARCjAjoECAAQA0oECEEYAEoECEYYAFAAWL0QYP8YaAJwAXgBgAF6iAG_B5IBAzEuOJgBAKABAbABCsABAQ&sclient=gws-wiz`
    }
    console.log(data);
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
                    <form onSubmit={onSubmit}>
                        <svg onClick={()=>document.location.href=`https://www.google.com/search?q=${searchValue}&biw=1920&bih=937&sxsrf=APq-WBuqhF6sNnSbSzYZTHKxVtElesJW8g%3A1650267364919&ei=5BRdYpXZN6XH2roPoKqkqAI&ved=0ahUKEwiV28eAjZ33AhWlo1YBHSAVCSUQ4dUDCA4&uact=5&oq=form%ED%83%9C%EA%B7%B8&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEOgQIIxAnOggILhCABBCxAzoLCAAQgAQQsQMQgwE6CAgAEIAEELEDOgUILhCABDoHCCMQ6gIQJzoOCC4QgAQQsQMQxwEQ0QM6BwgAEIAEEAo6CAguEIAEENQCOg4ILhCABBCxAxDHARCjAjoECAAQA0oECEEYAEoECEYYAFAAWL0QYP8YaAJwAXgBgAF6iAG_B5IBAzEuOJgBAKABAbABCsABAQ&sclient=gws-wiz`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/></svg>
                        <motion.input value={searchValue} onChange={(event:React.FormEvent<HTMLInputElement>)=>setSearchValue(event.currentTarget.value)} placeholder="type to search" type="text" />
                    </form>
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
                        <span>{weather?.main.temp?(weather.main.temp-273).toFixed(1):null}℃</span>
                        <span>{weather?.main.temp_min?(weather.main.temp_min-273).toFixed(1):null}/{weather?.main.temp_max?(weather.main.temp_max-273).toFixed(1):null}℃</span>
                    </WeatherInfo>
                </Weather>
                <Stock whileHover={{opacity:1}}>
                    <div>
                        <span>{data?.quote.symbol}</span>
                        <span>{data?.quote.companyName}</span>
                    </div>
                    <PriceInfo>
                        <span>${data?.quote.latestPrice}</span>
                        <span><span>{data?.quote.change}</span>({data? (data.quote.changePercent*100).toFixed(2):null}%)</span>
                    </PriceInfo>
                </Stock>
            </Content>
            <SideBar onMouseOver={()=>setSideBarMouseIn(true)} onMouseLeave={()=>setSideBarMouseIn(false)}>
            <AnimatePresence>
            {sideBarMouseIn?(
                <QuickIcons initial={{x:-50}} animate={{x:0}} exit={{x:-50, transition:{type:"linear"}}}>
                    <ul>
                        <li onMouseOver={()=>setProjectMouseIn(true)} onMouseLeave={()=>setProjectMouseIn(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M528 0h-480C21.5 0 0 21.5 0 48v320C0 394.5 21.5 416 48 416h192L224 464H152C138.8 464 128 474.8 128 488S138.8 512 152 512h272c13.25 0 24-10.75 24-24s-10.75-24-24-24H352L336 416h192c26.5 0 48-21.5 48-48v-320C576 21.5 554.5 0 528 0zM512 352H64V64h448V352z"/></svg>
                            {projectMouseIn?(
                                <SecondUl variants={secondVariants} initial="start" animate="end">
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://jooyoni.github.io/joostagram/" variants={childVariants} whileHover="hover" >주스타그램</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://jooyoni.github.io/Dama" variants={childVariants} whileHover="hover" >졸작</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://jooyoni.github.io/coin" variants={childVariants} whileHover="hover" >코인</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://jooyoni.github.io/my-web" variants={childVariants} whileHover="hover" >my-web</motion.a>
                                    </SecondLi>
                                </SecondUl>
                            ):null}
                        </li>
                        <li onMouseOver={()=>setOneMouseIn(true)} onMouseLeave={()=>setOneMouseIn(false)} >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M623.1 136.9l-282.7-101.2c-13.73-4.91-28.7-4.91-42.43 0L16.05 136.9C6.438 140.4 0 149.6 0 160s6.438 19.65 16.05 23.09L76.07 204.6c-11.89 15.8-20.26 34.16-24.55 53.95C40.05 263.4 32 274.8 32 288c0 9.953 4.814 18.49 11.94 24.36l-24.83 149C17.48 471.1 25 480 34.89 480H93.11c9.887 0 17.41-8.879 15.78-18.63l-24.83-149C91.19 306.5 96 297.1 96 288c0-10.29-5.174-19.03-12.72-24.89c4.252-17.76 12.88-33.82 24.94-47.03l190.6 68.23c13.73 4.91 28.7 4.91 42.43 0l282.7-101.2C633.6 179.6 640 170.4 640 160S633.6 140.4 623.1 136.9zM351.1 314.4C341.7 318.1 330.9 320 320 320c-10.92 0-21.69-1.867-32-5.555L142.8 262.5L128 405.3C128 446.6 213.1 480 320 480c105.1 0 192-33.4 192-74.67l-14.78-142.9L351.1 314.4z"/></svg>
                            {oneMouseIn?(
                                <SecondUl variants={secondVariants} initial="start" animate="end">
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://eclass.dongyang.ac.kr/" variants={childVariants} whileHover="hover" >동양미래대학교</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://www.ddazua.com/" variants={childVariants} whileHover="hover" >인터넷 강의</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="http://koreastudyroom.com/login_stu.asp" variants={childVariants} whileHover="hover" >코리아IT 아카데미</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants} >
                                        <motion.a href="https://nomadcoders.co/" variants={childVariants} whileHover="hover" >nomadcoder</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants} >
                                        <motion.a href="https://flexboxfroggy.com/#ko" variants={childVariants} whileHover="hover" >FlexBox Fropggy</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants} >
                                        <motion.a href="https://cssgridgarden.com/#ko" variants={childVariants} whileHover="hover" >Grid Garden</motion.a>
                                    </SecondLi>
                                </SecondUl>
                            ):null}
                        </li>
                        <li onMouseOver={()=>setTwoMouseIn(true)} onMouseLeave={()=>setTwoMouseIn(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M483.049 159.706c10.855-24.575 21.424-60.438 21.424-87.871 0-72.722-79.641-98.371-209.673-38.577-107.632-7.181-211.221 73.67-237.098 186.457 30.852-34.862 78.271-82.298 121.977-101.158C125.404 166.85 79.128 228.002 43.992 291.725 23.246 329.651 0 390.94 0 436.747c0 98.575 92.854 86.5 180.251 42.006 31.423 15.43 66.559 15.573 101.695 15.573 97.124 0 184.249-54.294 216.814-146.022H377.927c-52.509 88.593-196.819 52.996-196.819-47.436H509.9c6.407-43.581-1.655-95.715-26.851-141.162zM64.559 346.877c17.711 51.15 53.703 95.871 100.266 123.304-88.741 48.94-173.267 29.096-100.266-123.304zm115.977-108.873c2-55.151 50.276-94.871 103.98-94.871 53.418 0 101.981 39.72 103.981 94.871H180.536zm184.536-187.6c21.425-10.287 48.563-22.003 72.558-22.003 31.422 0 54.274 21.717 54.274 53.722 0 20.003-7.427 49.007-14.569 67.867-26.28-42.292-65.986-81.584-112.263-99.586z"/></svg>
                            {twoMouseIn?(
                                <SecondUl variants={secondVariants} initial="start" animate="end">
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://www.naver.com/" variants={childVariants} whileHover="hover" >Naver</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://www.google.com/" variants={childVariants} whileHover="hover" >Google</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://www.youtube.com/" variants={childVariants} whileHover="hover" >YouTube</motion.a>
                                    </SecondLi>
                                </SecondUl>
                            ):null}
                        </li>
                        <li onMouseOver={()=>setThreeMouseIn(true)} onMouseLeave={()=>setThreeMouseIn(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M421.7 220.3L188.5 453.4L154.6 419.5L158.1 416H112C103.2 416 96 408.8 96 400V353.9L92.51 357.4C87.78 362.2 84.31 368 82.42 374.4L59.44 452.6L137.6 429.6C143.1 427.7 149.8 424.2 154.6 419.5L188.5 453.4C178.1 463.8 165.2 471.5 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L291.7 90.34L421.7 220.3zM492.7 58.75C517.7 83.74 517.7 124.3 492.7 149.3L444.3 197.7L314.3 67.72L362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75z"/></svg>
                            {threeMouseIn?(
                                <SecondUl variants={secondVariants} initial="start" animate="end">
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://www.github.com/" variants={childVariants} whileHover="hover" >GitHub</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://www.fontawesome.com/" variants={childVariants} whileHover="hover" >FontAwesome</motion.a>
                                    </SecondLi>
                                    <SecondLi variants={secondLiVariants}>
                                        <motion.a href="https://www.codepen.io/pen/" variants={childVariants} whileHover="hover" >CodePen</motion.a>
                                    </SecondLi>
                                </SecondUl>
                            ):null}
                        </li>
                        <li onMouseOver={()=>setFourMouseIn(true)} onMouseLeave={()=>setFourMouseIn(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"/></svg>
                            {fourMouseIn?(
                                <SecondUl variants={secondVariants} initial="start" animate="end">
                            <SecondLi variants={secondLiVariants}>
                                <motion.a href="https://www.saramin.co.kr/zf_user/jobs/list/domestic?loc_mcd=101000%2C102000&cat_kewd=92&panel_type=&search_optional_item=n&search_done=y&panel_count=y" variants={childVariants} whileHover="hover" >사람人</motion.a>
                            </SecondLi>
                            <SecondLi variants={secondLiVariants}>
                                <motion.a href="https://apply.lh.or.kr/LH/index.html?Sls#MN::CLCC_MN_0010:" variants={childVariants} whileHover="hover" >LH청약센터</motion.a>
                            </SecondLi>
                            </SecondUl>
                            ):null}
                        </li>
                    </ul>
                </QuickIcons>
            ):null}
            </AnimatePresence>
            </SideBar>
        </Container>
    )
}
export default Main;