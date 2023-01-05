window.onload = function () {
    // setInterval(()=> {
    //     let time = document.querySelector('#time')
    //     time.innerHTML = dayjs().format('HH:mm:ss')
    // },1000)
    getDailyHotSearches()
    getWeather()
}
const box = document.querySelector('#box')
const Status_box = document.querySelector('#Status_box')
const About_seven_days = document.querySelector('#About_seven_days')
var today = {}
var todaynature = {}
var sevendaynature
var sevenday = []
var browserwidth = document.documentElement.clientWidth
var browserheight = document.documentElement.clientHeight
setElementCompatibility()
box.addEventListener('mousemove',(e) => {
    const [x,y] = [e.offsetX,e.offsetY]
    const [width,height] = [box.clientWidth,box.clientHeight]
    const sensitive = 20
    const ax = -(width / 2 - x) / sensitive
    const ay = (height / 2 - y) / sensitive
    Status_box.style.transform = `rotateY(${ax}deg) rotateX(${ay}deg)`
})
box.addEventListener('mouseleave',() => {
    Status_box.style.transform = `rotateY(0deg) rotateX(0deg)`
})

window.addEventListener('resize',(res) => {
    browserheight = document.documentElement.clientHeight
    setElementCompatibility()
})
const wearherObj = {
    qing: {
        img:'sunny-day.json',
        color:'linear-gradient(135deg,#fce38a,#f38181)'
    },
    yun: {
        img:'cloudy.json',
        color:"linear-gradient(135deg,#000c40,#607d8b)"
    },
    wu: {
        img:'fog.json',
        color:'linear-gradient(135deg,#00416a,#e4e5e6)'
    },
}
//元素自适应
function setElementCompatibility() {
    if(browserheight <= 770 || browserheight <= 850) {
        About_seven_days.style.height = '100%'
        About_seven_days.style.width = '200px'
        About_seven_days.style.flexWrap = "wrap"
        About_seven_days.style.margin = "0"
        About_seven_days.style.alignContent = "flex-start"
        About_seven_days.style.flexDirection = "column";
    } else {
        About_seven_days.style.width = '100%'
        About_seven_days.style.height = '150px'
        About_seven_days.style.margin = "0 auto"
        About_seven_days.style.flexDirection = "row";
    }
}
//获取天气
function getWeather() {
    fetch('https://www.yiketianqi.com/free/day?appid=97285255&appsecret=yJaVDb7F&unescape=1')
        .then(res => {
            let { status, statusText } = res
            if (status == 200) {
                return res.json()
            }
        })
        .then(data => {
            let weather = document.querySelector('#weather')
            weather.innerHTML = `
                    <p>当前城市：${data.city}</p>
                    <p>当前城市天气：${data.wea}</p>
                    <p>当前城市湿度：${data.humidity}</p>
                    <p>当前城市气压：${data.pressure}㍱</p>
                    <p>当前城市空气质量：${data.air}</p>
                    <p>当前城市今天气温：${data.tem}℃</p>
                    <p>城市今天最高气温/最低气温：${data.tem_day}℃/${data.tem_night}℃</p>
                    <p>当前风向/风速：${data.win}/${data.win_speed}</p>
<!--                    <p>当前星期：${data.week}</p>-->
                `
            console.log(data)
            today = data
            //xue、lei、shachen、bingbao、yu、yin
            Status_box.style.background = wearherObj[data.wea_img].color
            var de =  UpWeather(wearherObj[data.wea_img].img,'bm',todaynature)
            console.log(de)
        });
}
//获取近七天天气
function getDailyHotSearches() {
    fetch('https://v0.yiketianqi.com/free/week?appid=97285255&appsecret=yJaVDb7F&unescape=1')
        .then(res => {
            let { status, statusText } = res
            if (status == 200) {
                return res.json()
            }
        })
        .then(data => {
            console.log(data)
            sevenday = data.data
            var arr = []
            data.data.forEach((item,index) => {
                arr.push(`
                    <div class="days">
                        <div id="wath${(index+1)}">
                            <div class="daydata">
                                <p>${item.wea} <br> ${item.tem_day}℃/${item.tem_night}℃ <br> <span>${item.win}/${item.win_speed}</span> </p>
                            </div>
                        </div>
                    </div>`)
            })
            About_seven_days.innerHTML = arr.join('')
            var dayChildren = Array.from(About_seven_days.children)
            dayChildren.forEach((item ,index)=> {
                item.addEventListener('click', (e) => {
                    var operate
                    console.log(e)
                    console.log(index)
                    console.log(sevenday[index])
                    Status_box.style.background = wearherObj[sevenday[index].wea_img].color
                    if(index == 0) {
                        weather.innerHTML = `
                            <p>当前城市：${today.city}</p>
                            <p>当前城市天气：${today.wea}</p>
                            <p>当前城市湿度：${today.humidity}</p>
                            <p>当前城市气压：${today.pressure}㍱</p>
                            <p>当前城市空气质量：${today.air}</p>
                            <p>当前城市今天气温：${today.tem}℃</p>
                            <p>城市今天最高气温/最低气温：${today.tem_day}℃/${today.tem_night}℃</p>
                            <p>当前风向/风速：${today.win}/${today.win_speed}</p>
                        `
                        operate = UpWeather(wearherObj[sevenday[index].wea_img].img,'bm',todaynature)
                        operate.destroy(todaynature)
                        UpWeather(wearherObj[sevenday[index].wea_img].img,'bm',todaynature)
                        return
                    }
                    weather.innerHTML = `
                        <p>当日日期：${sevenday[index].date}</p>
                        <p>当前城市：${data.city}</p>
                        <p>当前城市当日天气：${sevenday[index].wea}</p>
                        <p>城市当日最高气温/最低气温：${sevenday[index].tem_day}℃/${sevenday[index].tem_night}℃</p>
                        <p>当日风向/风速：${sevenday[index].win}/${sevenday[index].win_speed}</p>
                    `
                    operate = UpWeather(wearherObj[sevenday[index].wea_img].img,'bm',todaynature)
                    operate.destroy(todaynature)
                    UpWeather(wearherObj[sevenday[index].wea_img].img,'bm',todaynature)
                })
            })
            data.data.forEach((item,index) => {
                UpWeather(wearherObj[item.wea_img].img,`wath${(index+1)}`)
                let wath = document.getElementById(`wath${(index+1)}`)
                wath.style.background = wearherObj[item.wea_img].color
            })
        });
}
//更新当前天气情况
function UpWeather(path,element,nature) {
    bodymovin.loadAnimation({
        container: document.getElementById(element),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: path,
        name:nature
    })
    return bodymovin
}
