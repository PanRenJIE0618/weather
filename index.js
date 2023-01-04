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

var browserwidth = document.documentElement.clientWidth
var browserheight = document.documentElement.clientHeight
console.log(browserheight)

if(browserheight <= 850) {
    About_seven_days.style.flexDirection = "column";
}
console.log(box)
box.addEventListener('mousemove',(e) => {
    console.log(e)
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
    console.log(browserheight)
    if(browserheight <= 770) {
        About_seven_days.style.height = '100%'
        About_seven_days.style.width = '200px'
        About_seven_days.style.flexWrap = "wrap"
        About_seven_days.style.margin = "0"
        About_seven_days.style.alignContent = "flex-start"
    }
    if(browserheight <= 850) {
        About_seven_days.style.width = '200px'
        About_seven_days.style.height = '100%'
        About_seven_days.style.margin = "0"
        About_seven_days.style.flexDirection = "column";
    } else {
        About_seven_days.style.width = '100%'
        About_seven_days.style.height = '150px'
        About_seven_days.style.margin = "0 auto"
        About_seven_days.style.flexDirection = "row";
    }
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
//获取天气
function getWeather() {
    fetch('https://www.yiketianqi.com/free/day?appid=97285255&appsecret=yJaVDb7F&unescape=1')
        .then(res => {
            console.log(res);
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
            console.log(Status_box)
            //xue、lei、shachen、bingbao、yu、yin

            Status_box.style.background = wearherObj[data.wea_img].color
            console.log(wearherObj[data.wea_img].img)
            UpWeather(wearherObj[data.wea_img].img,'bm')
        });
}
//获取近七天天气
function getDailyHotSearches() {
    fetch('https://v0.yiketianqi.com/free/week?appid=97285255&appsecret=yJaVDb7F&unescape=1')
        .then(res => {
            console.log(res);
            let { status, statusText } = res
            if (status == 200) {
                return res.json()
            }
        })
        .then(data => {
            console.log(data)
            var arr = []
            data.data.forEach((item,index) => {
                arr.push(`
                    <div class="days">
                        <div id="wath${(index+1)}">
                            <div class="daydata">
                                <p>${item.tem_day}℃/${item.tem_night}℃ <br> ${item.win}/${item.win_speed}</p>
                            </div>
                        </div>
                    </div>`)
            })
            About_seven_days.innerHTML = arr.join('')
            var dayChildren = Array.from(About_seven_days.children)
            console.log(dayChildren)
            dayChildren.forEach((item ,index)=> {
                console.log(item)
                item.addEventListener('click', (e) => {
                    console.log(e)
                    console.log(index)
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
function UpWeather(path,element) {
    bodymovin.loadAnimation({
        container: document.getElementById(element),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: path
    })
}
